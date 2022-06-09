import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
    plugins: [
        nodeResolve({ preferBuiltins: true }),
        commonjs(),
        json()
    ],
    input: './index.js',
    output:
    {
        format: "commonjs",
        file: "bundle.cjs"
    }
};
