const express = require("express")
const mysql= require("mysql2")
var bodyParser=require('body-parser')
var app=express()
var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'N0M3L0',
    database:'alumnos'
})
con.connect();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(express.static('public'))

app.post('/agregarUsuario',(req,res)=>{
        let Usuario=req.body.Usuario
        let id=req.body.id

        con.query('INSERT INTO usuario (idUsuario, Usuario) VALUES (?, ?)', [id, Usuario], (err, respuesta, fields) => {
            if (err) {
                console.log("Error al conectar", err);
                return res.status(500).send("Error al conectar");
            }
           
            return res.send(`<h1>Nombre:</h1> ${Usuario}`);
        });
   
})

app.listen(10000,()=>{
    console.log('Servidor escuchando en el puerto 10000')
})

//fun consultar


app.get('/obtenerUsuario',(req,res)=>{
    con.query('select * from usuario', (err,respuesta, fields)=>{
        if(err)return console.log('ERROR: ', err);
        var userHTML=``;
        var i=0;

        respuesta.forEach(user => {
            i++;
            userHTML+= `<tr><td>${i}</td><td>${user.Usuario}</td></tr>`;


        });

        return res.send(`<table>
                <tr>
                    <th>id</th>
                    <th>Nombre:</th>
                <tr>
                ${userHTML}
                </table>`
        );


    });
});

app.post('/borrarUsuario', (req, res) => {
    const idUsuario = req.body.idUsuario; // El ID del usuario a eliminar viene en el cuerpo de la solicitud
    console.log("hola")
    con.query('DELETE FROM usuario WHERE idUsuario = ?', [idUsuario], (err, resultado, fields) => {

        if (err) {
            console.error('Error al borrar el usuario:', err);
            return res.status(500).send("Error al borrar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con ID ${idUsuario} borrado correctamente`);
    });
});


app.post('/modificarusuario', (req, res)=> {
const idUsuario = req.body.idUsuario;
const Usuario = req.body.Usuario;
console.log("Hello")
con.query('UPDATE usuario SET Usuario=? WHERE idUsuario =?', [Usuario, idUsuario], (err, resultado, fields) =>{

    if (err) {
            console.error('Error de modificacion:', err);
            return res.status(500).send("Error de modificacion en el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con nombre ${Usuario} modificado correctamente correctamente`);

});

});