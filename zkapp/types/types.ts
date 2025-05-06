export type ParameterKind = 'string' | 'array' | 'struct' | 'field' | 'integer';

export type ParameterType = {
  kind: ParameterKind | string;
  length?: number;
  type?: ParameterType;
  fields?: Parameter[];
};

export type Parameter = {
  name: string;
  type: ParameterType;
  visibility: 'private' | 'public';
};

export type Circuit = {
  noir_version: string; // String to accept versions including beta (ej. "1.0.0-beta.3+ceaa1986")
  hash: number; // Compatible with product.json
  abi: {
    parameters: Parameter[];
    param_witnesses?: { [key: string]: { start: number; end: number }[] }; // Optional
    return_type: null | any; // Compatible with null in product.json
    return_witnesses?: any[]; // Optional
    error_types?: any; // Optional
  };
  bytecode: string;
  debug_symbols: string;
  file_map: {
    [key: string]: {
      source: string;
      path: string;
    };
  };
  names: string[];
};