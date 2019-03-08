# Mysql
## 插件egg-mysql
### 安装与配置
安装对应插件
```bash
$ npm i egg-mysql --save
```
开启插件
```js
// app/config/plugin.js
exports.mysql = {
    enable:true,
    package:'egg-mysql'
}
```
在 config/config.${env}.js 配置各个环境的数据库连接信息。
- 单数据源
```js
// config/config.${env}.js
exports.mysql = {
  // 单数据库信息配置
  client: {
    // host
    host: 'mysql.com',
    // 端口号
    port: '3306',
    // 用户名
    user: 'test_user',
    // 密码
    password: 'test_password',
    // 数据库名
    database: 'test',
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};
```
使用方法 app.mysql.query(sql,values);
- 多数据源
```js
exports.mysql = {
  clients: {
    // clientId, 获取client实例，需要通过 app.mysql.get('clientId') 获取
    db1: {
      // host
      host: 'mysql.com',
      // 端口号
      port: '3306',
      // 用户名
      user: 'test_user',
      // 密码
      password: 'test_password',
      // 数据库名
      database: 'test',
    },
    db2: {
      // host
      host: 'mysql2.com',
      // 端口号
      port: '3307',
      // 用户名
      user: 'test_user',
      // 密码
      password: 'test_password',
      // 数据库名
      database: 'test',
    },
    // ...
  },
  // 所有数据库配置的默认值
  default: {

  },

  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};
```
使用方法
```js
const client1 = app.mysql.get('db1');
await client1.query(sql,values)
const client1 = app.mysql.get('db1');
await client1.query(sql,values)
```
动态创建
```js
// {app_root}/app.js
module.exports = app =>{
    app.beforeStart(async ()=>{
        const mysqlConfig = app.configCenter.fetch('mysql');
        database = app.mysql.createInstance(mysqlConfig);
    })
}
```
## Service 层
对数据库的访问属于web应用的数据处理层，此部分代码应放置Service层维护。
## 编写CRUD语句
### create
直接使用insert方法插入一条记录
```js
// 往post表中插入数据
const result = await this.app.mysql.insert('posts',{title:'hello world '})
// => 等同sql语句 INSERT INTO 'posts'('title') values('hello world')
console.log(result);
// =>
// {
//     fieldCount:0,
//     affectedRows:1,
//     insertId:2232,
//     serverStatus:2,
//     warningCount:2,
//     message:'',
//     protocol141:true,
//     changedRow:0,
// }
// 判断是否插入成功
const insertSuccess = result.affectedRow === 1;
``` 
## Read
get select 
- 查询一条记录
```js
const post = await this.app.mysql.get('posts',{id:12})
=> SELECT * FROM `posts` WHERE `id` = 12 LIMIT 0, 1;
```
- 查询全表
```js
const results = await this.app.mysql.select('posts');
=> SELECT * FROM `posts`;
```
- 条件查询和结果定制
```js
const results = await this.app.mysql.select('post',{
    columns:['author','title'],
    where:{
        status:'draft',
        author:['susan','Pocy']
    },
    orders:[['created_at','desc'],['id','desc']],
    offset:0,
    limit:10
})
=> select author , title from posts
where status = 'draft' and author in ('susan','Pocy')
order by 'created_at' desc , 'id' desc 
limit 0,10
```
## updata 
更新数据库信息
``` js
// 修改数据，将会根据主键 ID 查找，并更新
const row = {
  id: 123,
  name: 'fengmk2',
  otherField: 'other field value',    // any other fields u want to update
  modifiedAt: this.app.mysql.literals.now, // `now()` on db server,取自数据库接口
};
const result = await this.app.mysql.update('posts', row); // 更新 posts 表中的记录

=> UPDATE `posts` SET `name` = 'fengmk2', `modifiedAt` = NOW() WHERE id = 123 ;

// 判断更新成功
const updateSuccess = result.affectedRows === 1;
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 如果主键是自定义的 ID 名称，如 custom_id，则需要在 `where` 里面配置
const row = {
  name: 'fengmk2',
  otherField: 'other field value',    // any other fields u want to update
  modifiedAt: this.app.mysql.literals.now, // `now()` on db server
};
const options = {
  where: {
    custom_id: 456
  }
};
const result = await this.app.mysql.update('posts', row, options); // 更新 posts 表中的记录

=> UPDATE `posts` SET `name` = 'fengmk2', `modifiedAt` = NOW() WHERE custom_id = 456 ;

// 判断更新成功
const updateSuccess = result.affectedRows === 1;
```
## delete
```js
const result = this.app.mysql.delete('posts',{
    author:'susan'
})
```
## 使用事务
事务常用于处理操作量大，复杂度高的数据
- 手动控制
```js
// 数据库操作均为异步
    const conn = this.app.mysql.beginTransaction();
    try{
        await conn.insert(table1,row1);
        await conn.update(table2,row2);
        await conn.commit();
    }catch(e){
        await conn.rollback();// 出现异常，一定要回滚事务。
        throw e; // 扔出错误
    }
```
- 自动控制：Transaction with scope
- API：beginTransactionScope(scope,ctx)
  - scope :generateFunction,在该函数中执行这次事务的所有sql语句。
  - ctx：防止出现事务嵌套
- 优点 使用简单不易犯错
- 缺点 无法做到细粒度的控制
```js
const result = await app.mysql.beginTransactionScope(async (conn)=>{
    await conn.insert(table1,row1);
    await conn.update(table2,row2);
    return {success:true};
},ctx)
```
## 表达式 Literal
调用Mysq内置函数
### 内置表达式
- NOW() 数据库当前系统时间，通过app.mysql.literal.now 获取

### 自定义表达式

