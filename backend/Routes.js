const bcrypt = require("bcryptjs");

class Routes {
	constructor(app, db) {
		this.login(app, db);
		this.registration(app, db);
		this.logout(app, db);
		this.isLoggedIn(app, db);
		this.changePswrd(app, db);
		this.stats(app, db);
	}
	
	login(app, db) {
		app.post('/login', (req, res) => {
			
			let username = req.body.username;
			let password = req.body.password;
					
			if (username.length > 15 || password.length > 15) {
				res.json({
					success: false,
					badPassword: false,
					msg: 'An error occurred, please try again'
				})
				return;
			}
			
			let att = [username];
			db.query('SELECT * FROM pouzivatelia WHERE BINARY meno = ? LIMIT 1', att, (err, data, fields) => {

				if (err) {
					res.json({
						success: false,
						badPassword: false,
						msg: 'An error occurred, please try again'
					})
					return;
				}
				
				//Nasli sme pouzivatela
				if(data && data.length === 1) {
					bcrypt.compare(password, data[0].heslo, (bcryptErr, verified) => {
						if (verified) {
							req.session.userID = data[0].id_pouzivatela;
							
							res.json({
								success: true,
								username: data[0].meno
							})	
							return;
						} else {
							res.json({
								success: false,
								badPassword: true,
								msg: 'Wrong password'
							})
							return;
						}
					});
				} else {
					res.json({
						success: false,
						badPassword: false,
						msg: 'User not found, please try again'
					})
					return;
				}
			});
		});
	}
	
	registration(app, db) {
		app.post('/registration', (req, res) => {
			
			let username = req.body.username;
			let email = req.body.email;
			let password = req.body.password;
			
			if (username.length > 15 || email.length > 25 || password.length > 15) {
				res.json({
					success: false,
					badName: false,
					badEmail: false,
					msg: 'An error occurred, please try again'
				})
				return;
			}
			
			let att = [username, email];
			
			db.query('SELECT * FROM pouzivatelia WHERE BINARY meno = ? OR email = ?', att, (err, data, fields) => {

				if (err) {
					res.json({
						success: false,
						badName: false,
						badEmail: false,
						msg: 'An error occurred, please try again'
					})
					return;	
				}
			
				if(data && data.length > 0) {
					
					let existN = false;
					let existE = false;
					
					for(let i=0; i < data.length; i++) {
						
						if (data[i].meno === username) {
							existN = true;
						}
						if (data[i].email === email) {
							existE = true;
						}
					}
					
					if (existN && existE) {
						
						res.json({
							success: false,
							badName: true,
							badEmail: true,
							msg: 'An error occurred, this name and this email already exist'
						})
						return;
						
					} else if (existN) {
						
						res.json({
							success: false,
							badName: true,
							badEmail: false,
							msg: 'An error occurred, this name already exists'
						})
						return;
						
					} else if (existE) {
						
						res.json({
							success: false,
							badName: false,
							badEmail: true,
							msg: 'An error occurred, this email already exists'
						})
						return;
						
					} else {
						
						res.json({
							success: false,
							badName: false,
							badEmail: false,
							msg: 'An error occurred, please try again'
						})
						return;
						
					}
				} else {
					
					let pswrd = bcrypt.hashSync(password, 9);

					db.query('INSERT INTO pouzivatelia SET ?', {meno: username, heslo: pswrd, email: email}, (err, data, fields) => {
						
						if(err) {
							
							res.json({
								success: false,
								badName: false,
								badEmail: false,
								msg: 'An error occurred, please try again'
							})
							return;
							
						}
						
						db.query('INSERT INTO statistiky SET ?', {h2_1_: 0, h2_2_: 0, h3_1_: 0, h3_2_: 0, h3_3_: 0, h4_1_: 0, h4_2_: 0, h4_3_: 0, h4_4_: 0, pocet_hier: 0}, (err, data2, fields) => {
							
							if(err) {
								res.json({
									success: false,
									badName: false,
									badEmail: false,
									msg: 'An error occurred, please try again'
								})
								return;
							}		
						});
						
						res.json({
							success: true,
							msg: 'Registration was successful, now you can log in'
						})
						return;
						
					});

				}	
			});
			
		});	
	}
	
	logout(app, db) {
		app.post('/logout', (req, res) => {
			
			if (req.session.userID) {
				req.session.destroy();
				res.json({
					success: true
				})
				return true;
			} else {
				res.json({
					success: false,
					msg: 'An error occurred while logging out'
				})
				return false;
			}
		});
	}
	
	isLoggedIn(app, db) {
		app.post('/isLoggedIn', (req, res) => {
			if (req.session.userID) {
				
				let att = [req.session.userID];
				db.query('SELECT * FROM pouzivatelia WHERE id_pouzivatela = ? LIMIT 1', att, (err, data, fields) => {
					
					if (data && data.length === 1) {
						res.json({
							success: true,
							username: data[0].meno
						})
						return true;
					} else {
						res.json({
							success: false
						})
						return false;
					}
				});
			} else {
				res.json({
					success: false
				})
				return false;
			}
		});	
	}
	
	stats(app, db){
		app.post('/statistics', (req, res) => {
			if (req.session.userID) {
				
				let att = [req.session.userID];
				db.query('SELECT * FROM pouzivatelia WHERE id_pouzivatela = ? LIMIT 1', att, (err, data, fields) => {
					
					if (data && data.length === 1) {
						let username = data[0].meno;
						
						if (username.length > 15) {
							res.json({
								success: false,
								msg: 'An error occurred, please try again'
							})
							return;
						}
						
						let att2 = [username];
						db.query('SELECT statistiky.* FROM pouzivatelia, statistiky WHERE BINARY pouzivatelia.meno = ? AND pouzivatelia.id_pouzivatela = statistiky.id_hraca LIMIT 1', 
							att2, (err, data2, fields) => {
										
							if (err) {
								res.json({
									success: false,
									msg: 'An error occurred, please try again'
								})
								return;
							}

							if(data2 && data2.length === 1) {
					
								if (data2[0].pocet_hier > 0) {
									
									let att3 = [data2[0].id_hraca];
									db.query('SELECT * FROM inf_o_hrach WHERE id_hraca = ? ORDER BY cislo_hry DESC', att3, (err, data3, fields) => {
									
										if (err) {
											res.json({
												success: false,
												msg: 'An error occurred, please try again'
											})
											return;
										}	
									
										res.json({
											success: true,
											onlyOne: false,
											stats1: data2[0],
											stats2: data3
										})
										return;							
									});					
								} else {
									res.json({
										success: true,
										onlyOne: true,
										stats1: data2[0]							
									})
									return;
								}			
							} else {
								res.json({
									success: false,
									msg: 'User statistics not found, please try again'
								})
								return;
							}			
						});
					} else {
						res.json({
							success: false,
							msg: 'User not find, please try again'
						})
						return false;
					}
				});
			} else {
				res.json({
					success: false,
					msg: 'An error occurred with User'
				})
				return false;
			}
		});	
	}

	changePswrd(app, db) {
		app.post('/changePassword', (req, res) => {
			
			let username = req.body.username;
			let oldPassword = req.body.oldPassword;
			let newPassword = req.body.newPassword;
			
			if (username.length > 15 || oldPassword.length > 15 || newPassword.length > 15) {
				res.json({
					success: false,
					msg: 'An error occurred, please try again'
				})
				return;
			}
			
			let att = [username];
			db.query('SELECT * FROM pouzivatelia WHERE BINARY meno = ? LIMIT 1', att, (err, data, fields) => {
				
				if (err) {
					res.json({
						success: false,
						msg: 'An error occurred, please try again'
					})
					return;
				}
				
				if(data && data.length === 1) {
					bcrypt.compare(oldPassword, data[0].heslo, (bcryptErr, verified) => {	
						if (verified) {
							let pswrd = bcrypt.hashSync(newPassword, 9);
							
							let att2 = [pswrd, username];
							db.query('UPDATE pouzivatelia SET heslo = ? WHERE meno = ?', att2, (err, data, fields) => {
								
								if(err) {
									res.json({
										success: false,
										msg: 'An error occurred, please try again'
									})
									return;
								}	
							});
							
							res.json({
								success: true,
								msg: 'You have successfully changed your password'
							})	
							return;
							
						} else {
							res.json({
								success: false,
								msg: 'An error occurred, you entered the wrong old password'
							})
							return;
						}
					});
				} else {
					res.json({
						success: false,
						msg: 'Error with logged in user, please try again'
					})
					return;
				}
			});
		});
	}	
}

module.exports = Routes;