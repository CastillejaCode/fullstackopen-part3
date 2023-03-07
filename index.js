const { response, request } = require('express');
const express = require('express');
const app = express();

let notes = [
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

app.get('/api/notes', (request, response) => {
	response.json(notes);
});

app.get('/info', (request, response) => {
	response.send(`Phonebook has info for ${notes.length} people\n${new Date()}`);
});

app.get('/api/notes/:id', (request, response) => {
	const id = Number(request.params.id);
	const note = notes.find((note) => note.id === id);

	if (note) {
		response.json(note);
	} else {
		response.status(404).end();
	}
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
