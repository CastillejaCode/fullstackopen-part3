// const { response, request } = require('express');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Person = require('./models/person');

app.use(cors());

app.use(express.static('dist'));

morgan.token('content', function (req, res) {
	return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content	`'));

app.use(express.json());

let persons = [];

app.get('/', (request, response) => {
	response.send('Howdy');
});

app.get('/api/persons', (request, response) => {
	Person.find({}).then((people) => response.json(people));
});

app.get('/info', (request, response) => {
	response.send(`Phonebook has info for ${persons.length} people\n${new Date()}`);
});

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((person) => person.id === id);

	if (note) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((note) => note.id !== id);
	response.status(204).end();
});

app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (!body.name) {
		return response.status(400).json({
			error: 'name or number missing',
		});
	}

	// else if (persons.some((person) => person.name === body.name)) {
	// 	response.status(400).json({
	// 		error: 'name must be unique',
	// 	});

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save().then((result) => response.json(result));
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
