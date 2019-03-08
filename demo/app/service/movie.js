const fs = require('fs');
const pump = require('mz-modules/pump'); //引入一个可异步的读写文件库
const Service = require('egg').Service;
// service 负责复杂业务逻辑

class MovieService extends Service{
    async insertMovie(){
// stream = 
//  fieldname: 'file',
//  filename: 'p452089833.webp',
//  encoding: '7bit',
//  transferEncoding: '7bit',
//  mime: 'image/webp',
//  mimeType: 'image/webp' }
// parts field = { title: 'y',
//   director: 'y',
//   rate: '10',
//   year: '2000',
//   quote: 'y',
//   img: '/public/images/p452089833.webp' 
// }
        const {ctx,app,config} = this;
        const exampleImage = `${config.baseDir}/app/public/images/example.jpg`;
        let stream,movie,postfix,result;
        const parts = ctx.multipart({ autoFields: true });
        stream = await parts();
        if(stream){
        // 有文件
            console.log('有文件');
            postfix = stream.filename.split('.')[1];
        }else{
        // 没文件
            stream = fs.createReadStream(exampleImage);            
            postfix = exampleImage.split('.')[1];
            console.log('没有图片');
        }
        const filename = `movie${new Date().getTime()}.${postfix}`;
        const dist = `${config.baseDir}/app/public/images/${filename}`;
        const writeStream = fs.createWriteStream(dist);
        await pump(stream,writeStream);
        movie = parts.field;
        movie.img = `/public/images/${filename}`;
        result = await app.mysql.insert('movie',movie);
        if(result.affectedRows === 1){ 
            return true;
        }else{
            return false;
        }
    
    }
    async deleteMovie(movieId){
        const {ctx,app} = this;
        const result = await app.mysql.delete('movie',{id:movieId});
        return result.affectedRows === 1;
    }
    async getAllMovie(){
        const {app} = this;
        const results = await app.mysql.select('movie');
        return results; //？还有其他能与controller层通信的方式
    }
    async searchMovie(key){
        const {ctx,app} = this;
        let sql;
        sql = `select  * from movie 
        where title like '%${key}%'
        or director like '%${key}%'
        or rate like '%${key}%'
        or year like '%${key}%'
        or quote like '%${key}%'`;
        const results = await app.mysql.query(sql);
        return results;
    }
    async getMovieById(id){
        const result = await this.app.mysql.get('movie',{id:id});
        console.log(result);
        return result;
    }
    async updateMovie(){
        const {app,ctx} = this;
        // oldImg 
        // 1.没有更换图片 2.更换图片 2.1 上传新图片 2.2删除旧图片
        const parts = ctx.multipart({autoFields:true});
        const stream = await parts();
        // parts.field不支持嵌套?
        const movie = JSON.parse(parts.field.movie);
        let oldImg = parts.field.oldImg; 
        console.log('typepf field = ',typeof parts.field,'field = ',parts.field);
        console.log('typepf movie = ',typeof movie,'movie = ',movie);
        console.log('typepf oldImg = ',typeof oldImg,'oldImg = ',oldImg);
        console.log('typepf stream = ',typeof stream);
        // if(oldImg !== movie.img){
        if(stream){
            oldImg = oldImg.split('/');
            const oldPath = `${this.config.baseDir}/app/public/images/${oldImg[oldImg.length-1]}`;
            const postfix = stream.filename.split('.')[1];
            const newPath = oldPath.replace('\.\w+','.'+postfix);
            // const filename = `movie${new Date().getTime()}.${postfix}`;
            const writeStream = fs.createWriteStream(oldPath);
            console.log('typepof oldPath = ',typeof oldPath,'oldPath = ',oldPath);
            console.log('typepof newPath = ',typeof newPath,'newPath = ',newPath);

            try{
                // FIXME:图片替换不能保证一致性
                // 将上传的文件写入旧文件，再改后缀
                await pump(stream,writeStream);
                fs.renameSync(oldPath,newPath);
                movie.img = movie.img.replace('/\.\w+/','.'+postfix);
                // await fs.unlink(oldImg);
                console.log('图片更新成功');
            }catch(e){
                console.log('图片更新失败');
                console.error(e.message);
                return false;
            }
        } 
        const result = await app.mysql.update('movie',movie);
        console.log('数据库更新');
        return result;
    }
}
module.exports = MovieService;