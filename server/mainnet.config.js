module.exports = {
    apps : [
      {
        name: 'proton-bots',
        script: 'dist/index.js',
        watch: false,
        env: {
            'CHAIN': 'proton'
        }
      }
    ]
};