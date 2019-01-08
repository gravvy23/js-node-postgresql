module.exports = function(app) {
	var list = require('../controllers/Controller');

	/*app.all('/*', function(req, res, next) {
	  res.setHeader("Access-Control-Allow-Origin", "*");
	  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');
	  next();
	});*/

	app.route('/users')
		.get(list.if_user_exists)
		.post(list.create_user);

	app.route('/users/:userId')
		.get(list.list_user_flights);
		
	app.route('/users/:userId/flights/:flightId')
		.get(list.find_user_flight)
		.post(list.add_luggage)
		.delete(list.delete_flight);

	app.route('/staff/:staffId')
		.get(list.list_all_flights);

	app.route('/staff/:staffId/flights/:flightId')
		.get(list.list_staff_flight);

	app.route('/flights')
		.get(list.find_flight);

	app.route('/routes/:routeId')
		.get(list.find_timetable);

	app.route('/flights/:flightId')
		.get(list.get_seats)
		.post(list.post_seat);

	app.route('/flights/:flightId/staff')
		.get(list.get_flight_staff);

	app.route('/login')
		.post(list.login);

	app.route('/login_worker')
		.post(list.login_worker);

	app.route('/routes/info/:routeId')
		.get(list.get_flight_info);
}