module.exports = {
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "@/scss/global.scss";`
            }
        }
    }
}