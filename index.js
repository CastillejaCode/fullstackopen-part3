require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const app = express();
const cors = require('cors');
const Person = require('./models/person');

app.use(cors());

app.use(express.static('dist'));

morgan.token('content', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content	`'));

app.use(express.json());

app.get('/', (request, response) => {
	response.send('Howdy');
});

app.get('/api/persons', (request, response) => {
	Person.find({}).then((people) => response.json(people));
});

app.get('/info', async (request, response) => {
	const persons = await Person.find({});
	response.send(`Phonebook has info for ${persons.length} people\n${new Date()}`);
});

app.get('/api/persons/:id', (request, response, next) => {
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
	const { name, number } = request.body;

	Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
		.then((result) => response.json(result))
		.catch((error) => next(error));
});

app.post('/api/persons', async (request, response, next) => {
	const body = request.body;

	if (!body.name) {
		return response.status(400).json({
			error: 'name or number missing',
		});
	}

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

	if (error.name === 'CastError') response.status(400).send({ error: 'malformatted id' });

	if (error.name === 'ValidationError') response.status(400).json({ error: error.message });

	next(error);
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
