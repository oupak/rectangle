const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
	//connectionString: 'postgres://postgres:oung@localhost/rectangles'
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
})

var app = express()

// json
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	var getRectQuery = 'SELECT * FROM rectangle';
	pool.query(getRectQuery, (error,result) => {
		if (error)
			res.end(error);
		var results = {'rows':result.rows}
		res.render('pages/index',results);
	})
});

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.post('/addrect', (req, res) => {
	var name = req.body.name;
	var width = req.body.width;
	var height = req.body.height;
	var color = req.body.color;
	//res.send(`name: ${name}, width: ${width}, height: ${height}`);
	var addRectQuery = "INSERT INTO rectangle (name, width, height, color) VALUES ('"+name+"', '"+width+"', '"+height+"', '"+color+"')";
	pool.query(addRectQuery, (error,result) => {
		if (error)
			res.end(error);
	})
	res.redirect("/");
});

app.get('/rectangle', (req, res) => {
	var id = req.query.id;
	var getRectQuery = 'SELECT * FROM rectangle WHERE id='+id+';';
	pool.query(getRectQuery, (error,result) => {
		if (error)
			res.end(error);
		var results = {'rows':result.rows}
		res.render('pages/rectangle',results);
	})
});

app.post('/delete', (req, res) => {
	var id = req.body.id;
	var delRectQuery = 'DELETE FROM rectangle WHERE id='+id+';';
	pool.query(delRectQuery, (error,result) => {
		if (error)
			res.end(error);
	})
	res.redirect("/");
});

/*app.get('/database', (req, res) => {
	var getRectQuery = 'SELECT * FROM rectangle';
	pool.query(getRectQuery, (error,result) => {
		if (error)
			res.end(error);
		var results = {'rows':result.rows}
		res.render('pages/db',results);
	})
});*/

//app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
app.listen(process.env.PORT || 5000, () => console.log("Listening on port"))