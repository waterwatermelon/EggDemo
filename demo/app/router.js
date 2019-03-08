module.exports =  (app)=>{
    const {router,controller} = app;
    // 路由规则 '/' 默认登录界面 '/movies' 电影列表
    router.get('/',controller.home.index);
    router.get('/register',controller.home.register);
    router.get('/movies',controller.movie.index);
    // 不加这条路由，前端会有404的xhr响应
    // router.post('/movies',controller.movies.index);
    // 用户相关路由 
    router.post('/api/register',controller.user.register);
    router.post('/api/login',controller.user.login);
    router.post('/api/logout',controller.user.logout);
    // 电影相关路由
    router.post('/api/insertMovie',controller.movie.insertMovie);
    router.post('/api/deleteMovie',controller.movie.deleteMovie);
    router.post('/api/getAllMovie',controller.movie.getAllMovie);
    router.post('/api/searchMovie',controller.movie.searchMovie);
    router.post('/api/getMovieById',controller.movie.getMovieById);
    router.post('/api/updateMovie',controller.movie.updateMovie);

};