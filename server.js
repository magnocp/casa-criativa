const express = require("express");

const server = express();

const db = require("./db")

/*const ideas = [
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
        title: "Cursos de Programação",
        category: "Estudo",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias voluptatem amet veritatis ullam, numquam voluptas repudiandae consectetur sequi consequatur. Ad a quibusdam explicabo animi sed quas natus ipsam perferendis at.",
        url: "#"
    },
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729005.svg",
        title: "Exercicios",
        category: "Saúde",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias voluptatem amet veritatis ullam, numquam voluptas repudiandae consectetur sequi consequatur. Ad a quibusdam explicabo animi sed quas natus ipsam perferendis at.",
        url: "#"
    },
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
        title: "Meditação",
        category: "Mentalidade",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias voluptatem amet veritatis ullam, numquam voluptas repudiandae consectetur sequi consequatur. Ad a quibusdam explicabo animi sed quas natus ipsam perferendis at.",
        url: "#"
    },
    {
        img: "https://image.flaticon.com/icons/svg/1776/1776597.svg",
        title: "Tocar um instrumento",
        category: "Diversão",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias voluptatem amet veritatis ullam, numquam voluptas repudiandae consectetur sequi consequatur. Ad a quibusdam explicabo animi sed quas natus ipsam perferendis at.",
        url: "#"
    },
]*/

// arquivos estaticos
server.use(express.static('public'))

// habilitar uso do req.bory
server.use(express.urlencoded({ extended: true }))

//nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views",{
    express: server, 
    noCache: true,   
})


// rotas
server.get("/", function (req, res){

    db.all(`SELECT * FROM ideas`, function (err, rows){
        if (err) return console.log(err)

        const reversedIdeas = [...rows].reverse()

        let lastIdeas = []

        for( let idea of reversedIdeas){
            if(lastIdeas.length < 2){
                lastIdeas.push(idea)
            }
        }   

        return res.render("index.html", { ideas: lastIdeas })
        })
})
// lista
server.get("/ideias", function (req, res){

    db.all(`SELECT * FROM ideas`, function (err, rows){
        if (err){
            console.log(err)
            return res.send("Erro no banco de dados!")
        } 

        const reversedIdeas = [...rows].reverse()
        return res.render("ideias.html", { ideas: reversedIdeas })

    })   
})

server.post("/", function(req, res){
    // Inserir dados
    const query =  (`    
            INSERT INTO ideas(
                image,
                title, 
                category,
                description,
                link
            )VALUES(?, ?, ?, ?, ?);
    `)

    const values = [
        req.body.image, 
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link        
    ]

    db.run(query, values, function(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no bano de dados!")
        }
        return res.redirect("/ideias")        
    })
    
})
// Delete
server.get('/apagar/:id', function(req, res){
    
    const id = (req.params.id)     

    db.run(`DELETE FROM ideas WHERE id = ? `, [id], function(err){
        if (err){
            console.log(err)
            return res.send("Erro no banco de dados!")
        }     
    })   

    return res.redirect("/")
})


server.listen(3000);