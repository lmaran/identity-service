module.exports = () => {
    return {
        files: [
            'server/**/*.ts',
            '!server/**/*.test.ts'
        ],

        tests: [
            'server/**/*.test.ts'
        ],

        testFramework: 'mocha',

        setup: function () {
            console.log('global wallaby setup: ' + process.pid);
            // global.expect = require('chai').expect;
        },

        teardown: function(){
            console.log('global wallaby teardown');
        },

        env: {
            type: 'node',
            runner: 'node'
        },

        filesWithNoCoverageCalculated: ['server/server.ts']

        // workers: {
        //     regular: 1,
        //     initial: 1,
        //     recycle: true,
        // }

        // // you may remove the setting if you have a tsconfig.json file where the same is set
        // compilers: {
        //   '**/*.ts': w.compilers.typeScript({module: 'commonjs'})
        // }

    };
};