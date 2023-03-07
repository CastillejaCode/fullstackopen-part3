const { response, request } = require('express');
const express = require('express');
const morgan = require('morgan');
const app = express();

morgan.token('content', function (req, res) {
	return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

app.use(express.json());

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

app.get('/', (request, response) => {
	response.send('Howdy');
});

app.get('/api/persons', (request, response) => {
	response.json(persons);
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
	const randomID = Math.random() * 1000;
	const body = request.body;

	if (!body.name || !body.number) {
		response.status(400).json({
			error: 'name or number missing',
		});
	} else if (persons.some((person) => person.name === body.name)) {
		response.status(400).json({
			error: 'name must be unique',
		});
	} else {
		const person = {
			id: randomID,
			name: body.name,
			number: body.number,
		};

		persons = persons.concat(person);

		response.json(person);
	}
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
