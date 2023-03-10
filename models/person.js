const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose
	.connect(url)
	.then((result) => console.log(`connected to ${url}`))
	.catch((error) => console.log(`FAILED`));

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	number: {
		type: String,
		minLength: 8,
		validate: {
			validator: function (v) {
				return /\d{2,}-\d{1,}/g.test(v);
			},
			message: (props) => `${props.value} is not a valid phone number!`,
		},
	},
});

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Person', personSchema);

// let nameDB = process.argv[3];
// let numberDB = process.argv[4];

// const person = new Person({
// 	name: nameDB,
// 	number: numberDB,
// });

// if (process.argv.length < 4) {
// 	Person.find({}).then((result) => {
// 		console.log(`phonebook:`);
// 		result.forEach((person) => console.log(person.name, person.number));
// 		mongoose.connection.close();
// 	});
// } else {
// 	person.save().then((result) => {
// 		console.log(`added ${nameDB} number ${numberDB} to phonebook`);
// 		mongoose.connection.close();
// 	});
// }
