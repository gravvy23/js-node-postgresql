var dbase = require('../models/Model');

/*dbase.query('SELECT * FROM projekt.uc07(1)')
	.then(res => {
		console.log(res.rows);
	})
	.catch(e => console.error(e.stack))*/

/*dbase.query('SELECT * FROM projekt.uc07($1)',[1], function(err,res){
	console.log(res);
});*/

/*dbase.query('SELECT * FROM projekt.uc10(1)', function(err,res){
	console.log(res.rows);
});*/

/*dbase.func('projekt.uc07',1)
	.then(data => {
		console.log(data);
	})
	.catch(e => console.error(e.stack))*/

exports.if_user_exists = function(req,res){
	if (req.query.login)
	{
		dbase.query(`SELECT * FROM projekt.uc09('${req.query.login}')`,(err,r) => {
			res.json({login: r.rows[0].uc09});
		});
	}
	else {
		res.json({message: 'if_user_exists'});
	}
};

exports.create_user = function(req,res){
	var query = {
		name: 'add-user',
		text: 'INSERT INTO projekt.uzytkownik(login,passwd,imie,nazwisko,data_urodzenia,narodowosc,nr_dokumentu) VALUES ($1,$2,$3,$4,$5,$6,$7);',
		values: [req.body.login, req.body.passwd, req.body.imie, req.body.nazwisko, req.body.data_urodzenia, req.body.narodowosc, req.body.nr_dokumentu]
	};
	dbase.query(query, (err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
	  	} else {
			res.json({status: 'OK'});
  		}
	});
};

exports.list_user_flights = function(req,res){
	dbase.query(`SELECT * FROM projekt.uc07(${parseInt(req.params.userId)})`, (err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
		} else {
			res.json(r.rows);
		}
	});
};

exports.find_user_flight = function(req,res){
	dbase.query(`SELECT * FROM projekt.uc08(${parseInt(req.params.userId)},'${req.params.flightId}')`,(err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
		} else {
			res.json(r.rows);
		}
	});
};

exports.add_luggage = function(req,res){
	dbase.query(`SELECT * FROM projekt.uc15('${req.params.flightId}',${req.body.miejsce},${req.body.typ},${parseInt(req.params.userId)})`, (err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
	  	} else {
			res.json({status: 'OK'});
  		}
	});
};

exports.delete_flight = function(req,res){
	dbase.query(`SELECT * FROM projekt.uc13(${req.params.userId},'${req.params.flightId}')`, (err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
	  	} else {
			res.json({status: 'OK'});
  		}
	});
};

exports.list_all_flights = function(req,res){
	dbase.query(`SELECT * FROM projekt.uc10(${req.params.staffId})`, (err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
	  	} else {
			res.json(r.rows);
  		}
	});
};

exports.list_staff_flight = function(req,res){
	dbase.query(`SELECT * FROM projekt.uc11(${req.params.staffId},'${req.params.flightId}')`, (err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
	  	} else {
			res.json(r.rows);
  		}
	});
};

exports.find_flight = function(req,res){
	if (req.query.city){
		dbase.query(`SELECT * FROM projekt.uc02('${req.query.city}')`, (err,r) => {
			if (err) {
				res.json({status: 'ERROR'});
		  	} else {
				res.json(r.rows);
	  		}
		});
	} else {
		dbase.query(`SELECT * FROM projekt.uc01()`, (err,r) => {
			if (err) {
				res.json({status: 'ERROR'});
		  	} else {
				res.json(r.rows);
	  		}
		});
	}
};

exports.find_timetable = function(req, res){
	if (req.query.month){
		var route = req.params.routeId;
		var month = req.query.month;
		dbase.query(`SELECT * FROM projekt.uc03('${route}','${month}')`, (err,r) => {
			if (err) {
				res.json({status: 'ERROR'});
				 } else {
				res.json(r.rows);
			  }
		});
	} else {
		res.json({status: 'ERROR'});
	}
};

exports.get_seats = function(req,res){
	dbase.query(`SELECT * FROM projekt.uc04('${req.params.flightId}')`, (err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
	  	} else {
			res.json(r.rows);
  		}
	});
};

exports.post_seat = function(req,res){
	dbase.query(`SELECT * FROM projekt.uc14(${req.body.uzytkownik},'${req.params.flightId}',${req.body.miejsce},'${req.body.imie}','${req.body.nazwisko}','${req.body.data_urodzenia}','${req.body.narodowosc}')`, (err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
	  	} else {
			res.json(r.rows);
  		}
	});
};

exports.get_flight_staff = function(req,res){
	dbase.query(`SELECT * FROM projekt.uc16('${req.params.flightId}')`, (err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
	  	} else {
			res.json(r.rows);
  		}
	});
};

exports.login = function(req,res){
	dbase.query(`SELECT * FROM projekt.uc17('${req.body.login}','${req.body.passwd}')`, (err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
	  	} else {
			res.json(r.rows[0].uc17);
  		}
	});
};

exports.login_worker = function(req,res){
	console.log(req.body);
	dbase.query(`SELECT * FROM projekt.uc18('${req.body.login}','${req.body.passwd}')`, (err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
	  	} else {
			res.json(r.rows[0].uc18);
  		}
	});
};

exports.get_flight_info = function(req, res){
	dbase.query(`SELECT * FROM projekt.uc19('${req.params.routeId}')`, (err,r) => {
		if (err) {
			res.json({status: 'ERROR'});
			 } else {
			res.json(r.rows);
		  }
	});
};