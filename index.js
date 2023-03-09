const { response, request } = require('express');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Person = require('./models/person');
const { default: mongoose } = require('mongoose');

app.use(cors());

app.use(express.static('dist'));

morgan.token('content', function (req, res) {
	return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content	`'));

app.use(express.json());

app.get('/', (request, response) => {
	response.send('Howdy');
});

app.get('/api/persons', (request, response) => {
	Person.find({}).then((people) => response.json(people));
});

app.get('/info', async (request, response) => {
	let persons = await Person.find({});
	response.send(`Phonebook has info for ${persons.length} people\n${new Date()}`);
});

app.get('/api/persons/:id', (request, response, next) => {
	console.log('id', request.params.id);
	Person.findById(request.params.id)
		.then((note) => {
			response.json(note);
		})
		.catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then((result) => response.status(204).end())
		.catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
	let body = request.body;
	const person = {
		name: body.name,
		number: body.number,
	};
	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then((result) => response.json(result))
		.catch((error) => next(error));
});

app.post('/api/persons', async (request, response, next) => {
	let body = request.body;

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

	person
		.save()
		.then((result) => response.json(result))
		.catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	}

	next(error);
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
