const mongoose = require('mongoose');

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@fso-3.8h1szfo.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);

let nameDB = process.argv[3];
let numberDB = process.argv[4];

const person = new Person({
	name: nameDB,
	number: numberDB,
});

if (process.argv.length < 4) {
	Person.find({}).then((result) => {
		console.log(`phonebook:`);
		result.forEach((person) => console.log(person.name, person.number));
		mongoose.connection.close();
	});
} else {
	person.save().then((result) => {
		console.log(`added ${nameDB} number ${numberDB} to phonebook`);
		mongoose.connection.close();
	});
}
