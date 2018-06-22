const Joi = require('joi');
const express = require('express');
const app = express();

//middleware
app.use(express.json());

const courses = [
    {
        id:1, name: 'course1'
    },
    {
        id:2, name: 'course2'
    },
    {
        id:3, name: 'course3'
    },
];

app.get('/', (req, res) => {
    res.send('Hellow Word');
})

app.get('/api/courses', (req, res) => {
    res.send(courses);
})

app.get('/api/course/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){//404
        res.status(404).send('The course with the given ID was not found !');
        return;
    }
    res.send(course);
});

app.post('/api/courses', (req,res) =>{
    //const result = validateCourse(req.body);
    const {error} = validateCourse(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    // if(!req.body.name || req.body.name.length < 3){
    //     res.status(400).send('Name is requires and should be minimum 3 character !');
    //     return;
    // }
    const course = {
        id : courses.length +1,
        name : req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/course/:id',(req,res) =>{
    //Look up the course
    //if not existin,return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){//404
        res.status(404).send('The course with the given ID was not found !');
        return;
    }
    //validate
    //if invalid, return 400 - Bad request
    const {error} = validateCourse(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    //Update course
    //Return the updated course
    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/course/:id', (req,res) => {
    //Look up the course
    //Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){//404
        res.status(404).send('The course with the given ID was not found !');
        return;
    }

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index,1);
    
    //Return the same course
    res.send(course);
})

//Sampel request : http://localhost:3100/api/post/2018/june?sortBy=name
app.get('/api/post/:year/:month', (req, res) => {
    req.params.query = req.query;
    res.send(req.params);
});

function validateCourse(course){
    const schema = {
        name : Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

//PORT
 const port = process.env.PORT || 3000;
app.listen(port, ()=>{console.log(`Listening the port ${port}!`)});