package com.zkapp

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.*
import com.noirandroid.lib.Circuit
import com.noirandroid.lib.Proof
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream

class NoirModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "NoirModule"
    private val circuits: HashMap<String, Circuit> = HashMap()

    fun loadCircuit(circuitData: String, promise: Promise): String? {
        try {
            val circuit = Circuit.fromJsonManifest(circuitData)
            val id = circuit.manifest.hash.toLong().toString()
            circuits[id] = circuit
            return id
        } catch (e: Exception) {
            Log.d("CIRCUIT_LOAD_FAIL", e.toString())
            promise.reject("CIRCUIT_LOAD_FAIL", "Unable to load circuit. Please check the circuit was compiled with the correct version of Noir")
            return null
        }
    }

    fun writeRawResourceToFile(resourceId: Int, fileName: String): String {
        val inputStream = reactApplicationContext.resources.openRawResource(resourceId)
        val file = File(reactApplicationContext.filesDir, fileName)
        val fileOutputStream = FileOutputStream(file)
        try {
            val buffer = ByteArray(1024)
            var length: Int
            while (inputStream.read(buffer).also { length = it } != -1) {
                fileOutputStream.write(buffer, 0, length)
            }
            return file.absolutePath
        } finally {
            fileOutputStream.close()
            inputStream.close()
        }
    }

    fun getLocalSrsPath(): String? {
        val resId = reactApplicationContext.resources.getIdentifier("srs", "raw", reactApplicationContext.packageName)
        if (resId == 0) {
            Log.d("SRS_FILE_NOT_FOUND", "srs.local file not found in /app/src/main/res/raw, reverting to online SRS")
            return null
        }
        val srsFile = File(reactApplicationContext.filesDir, "srs")
        if (srsFile.exists()) {
            val srsSize = srsFile.length()
            Log.d("SRS_FILE_SIZE", "srs.local found in internal storage is $srsSize bytes")
            return srsFile.absolutePath
        }
        val srsPath = writeRawResourceToFile(resId, "srs")
        Log.d("SRS_FILE_WRITTEN", "srs.local file written to internal storage")
        return srsPath
    }

    @ReactMethod
    fun prepareSrs(promise: Promise) {
        Thread {
            try {
                getLocalSrsPath()
                val result = Arguments.createMap()
                result.putBoolean("success", true)
                promise.resolve(result)
            } catch (e: Exception) {
                Log.e("SRS_SETUP_ERROR", e.toString())
                promise.reject("SRS_SETUP_ERROR", e.message)
            }
        }.start()
    }

    @ReactMethod
    fun setupCircuit(circuitData: String, recursive: Boolean, promise: Promise) {
        Thread {
            val circuitId = loadCircuit(circuitData, promise)
            if (circuitId == null) return@Thread

            val circuit = circuits[circuitId]
            val localSrs = getLocalSrsPath()
            if (circuit != null && localSrs != null) {
                try {
                    circuit.setupSrs(localSrs, recursive)
                    val result = Arguments.createMap()
                    result.putString("circuitId", circuitId)
                    promise.resolve(result)
                } catch (e: Exception) {
                    Log.e("CIRCUIT_SETUP_ERROR", e.toString())
                    promise.reject("CIRCUIT_SETUP_ERROR", e.message)
                }
            } else {
                promise.reject("SRS_SETUP_FAIL", "Failed to load SRS file")
            }
        }.start()
    }

    @ReactMethod
    fun prove(inputs: ReadableMap, circuitId: String, proofType: String, recursive: Boolean, promise: Promise) {
        Thread {
            val circuit = circuits[circuitId]
            if (circuit == null) {
                promise.reject("CIRCUIT_NOT_LOADED", "Circuit not loaded. Please load the circuit before generating a proof")
                return@Thread
            }
            try {
                @Suppress("UNCHECKED_CAST")
                val proof = circuit.prove(inputs.toHashMap() as Map<String, Any>, proofType ?: "honk", recursive)
                val result = Arguments.createMap()
                result.putString("proof", proof.proof)
                result.putString("vkey", proof.vk)
                promise.resolve(result)
            } catch (e: Exception) {
                Log.e("PROOF_GENERATION_ERROR", e.toString())
                promise.reject("PROOF_GENERATION_ERROR", e.message)
            }
        }.start()
    }

    @ReactMethod
    fun verify(proof: String, vkey: String, circuitId: String, proofType: String, promise: Promise) {
        Thread {
            val circuit = circuits[circuitId]
            if (circuit == null) {
                promise.reject("CIRCUIT_NOT_LOADED", "Circuit not loaded. Please load the circuit before verifying a proof")
                return@Thread
            }
            try {
                val proofObj = Proof(proof, vkey)
                val verified = circuit.verify(proofObj, proofType ?: "honk")
                val result = Arguments.createMap()
                result.putBoolean("verified", verified)
                promise.resolve(result)
            } catch (e: Exception) {
                Log.e("PROOF_VERIFICATION_ERROR", e.toString())
                promise.reject("PROOF_VERIFICATION_ERROR", e.message)
            }
        }.start()
    }

    @ReactMethod
    fun clearCircuit(circuitId: String, promise: Promise) {
        Thread {
            circuits.remove(circuitId)
            val result = Arguments.createMap()
            result.putBoolean("success", true)
            promise.resolve(result)
        }.start()
    }

    @ReactMethod
    fun clearAllCircuits(promise: Promise) {
        Thread {
            circuits.clear()
            val result = Arguments.createMap()
            result.putBoolean("success", true)
            promise.resolve(result)
        }.start()
    }
}