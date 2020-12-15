module.exports = {
    apps : [
      {
        name: 'proton-bots',
        script: 'dist/index.js',
        node_args : '-r dotenv/config',
        instances : 4,
        watch: false,
        env: {
            'CHAIN': 'proton'
        }
      }
    ]
};