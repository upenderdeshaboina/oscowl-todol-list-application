const express=require('express')
const {open}=require('sqlite')
const sqlite3=require('sqlite3')
const path=require('path')
const cors=require('cors')
require('dotenv').config()
const {v4:uuid}=require('uuid')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const app=express()
app.use(express.json())
const dbPath=path.join(__dirname,'./todo-list.db')
app.use(cors())
PORT=process.env.PORT || 3010
const MY_SECRET_CODE=process.env.MY_SECRET_CODE
let db;

const initializingDbAndServer=async()=>{
    try {
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        console.log('initializing database done')
    
        await db.exec(`
                CREATE TABLE IF NOT EXISTS users(
                    id TEXT PRIMARY KEY,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL
                );
    
                CREATE TABLE IF NOT EXISTS todo(
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    status TEXT NOT NULL,
                    user_id TEXT,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                );
    
        `)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
initializingDbAndServer()


// user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters long.' });
    }
    const id = uuid();
    
    try {
        const userExistsQuery = `SELECT * FROM users WHERE username = ?`;
        const userExists = await db.get(userExistsQuery, [username]);
        if (userExists) {
            return res.status(400).json({ msg: 'Username already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserQuery = `INSERT INTO users(id, username, password) VALUES (?, ?, ?)`;
        const response = await db.run(insertUserQuery, [id, username, hashedPassword]);
        if (response.changes > 0) {
            return res.status(201).json({ msg: 'User created successfully.' });
        } else {
            return res.status(500).json({ msg: 'User creation failed.' });
        }
    } catch (error) {
        return res.status(500).json({ msg: 'An error occurred.', error: error.message });
    }
})

// user login 
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userQuery = `SELECT * FROM users WHERE username = ?`;
        const user = await db.get(userQuery, [username]);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid username or password.' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: 'Invalid username or password.' });
        }
        const token = jwt.sign({ id: user.id, username: user.username }, MY_SECRET_CODE);
        return res.status(200).json({token });
    } catch (error) {
        return res.status(500).json({ msg: 'An error occurred.', error: error.message });
    }
});



// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ error: 'Forbidden' });

    jwt.verify(token, process.env.MY_SECRET_CODE, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token is invalid or expired' });
        req.user = user;
        next();
    });
};

// update user details like username or password
app.put('/update-user', authenticateToken, async (req, res) => {
    const { id } = req.user; 
    const { username, oldPassword, newPassword } = req.body;

    if (!username && !oldPassword && !newPassword) {
        return res.status(400).json({ msg: 'Please provide at least one field to update (username, oldPassword, or newPassword).' });
    }

    if (newPassword && !oldPassword) {
        return res.status(400).json({ msg: 'Please provide the old password to change your password.' });
    }

    try {
        const userQuery = `SELECT * FROM users WHERE id = ?`;
        const user = await db.get(userQuery, [id]);

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        if (oldPassword) {
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ msg: 'The old password is incorrect.' });
            }
        }

        let query = `UPDATE users SET `;
        const values = [];

        if (username) {
            query += `username = ?, `;
            values.push(username);
        }

        if (newPassword) {
            if (newPassword.length < 6) {
                return res.status(400).json({ msg: 'New password must be at least 6 characters long.' });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            query += `password = ?, `;
            values.push(hashedPassword);
        }

        query = query.slice(0, -2); // last comma removing
        query += ` WHERE id = ?`;
        values.push(id);
        const response = await db.run(query, values);
        if (response.changes > 0) {
            return res.status(200).json({ msg: 'User information updated successfully.' });
        } else {
            return res.status(404).json({ msg: 'No changes were made or user not found.' });
        }

    } catch (error) {
        return res.status(500).json({ msg: 'An error occurred.', error: error.message });
    }
});

// user data
app.get('/user-data',authenticateToken,async(req,res)=>{
    const {id}=req.user
    const query=`select username from users where id=?`
    try {
        const data=await db.get(query,[id])
        res.status(200).json({userData:data})
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
})

// deleting user 
app.delete('/delete-user',authenticateToken,async(req,res)=>{
    const {id}=req.user
    const query=`delete from users where id=?`
    try {
        await db.run(query,[id])
        res.status(200).json({msg:'user deleted successfully..'})
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
})


// adding todo
app.post('/add-todo',authenticateToken, async (req, res) => {
    const { title, status} = req.body;
    const {id}=req.user

    if (!title || !status) {
        return res.status(400).json({ msg: 'Please provide title and status..' });
    }
    const todoId = uuid();
    const query = `INSERT INTO todo (id, title, status, user_id) VALUES (?, ?, ?, ?)`;
    try {
        const response = await db.run(query, [todoId, title, status, id]);
        
        if (response.changes > 0) {
            return res.status(201).json({ msg: 'To-do added successfully.'});
        }
    } catch (error) {
        return res.status(500).json({ msg: 'An error occurred.', error: error.message });
    }
});

// get all the tweets
app.get('/todos',authenticateToken,async(req,res)=>{
    const {id}=req.user
    const query=`select id,title,status from todo where user_id=?`

    try {
        const response=await db.all(query,[id])
        if(response.length>0){
            return res.status(200).json({todos:response})
        }
    } catch (error) {
        return res.status(500).json({msg:'An error occurred.',error:error.message})
    }
})

// update todo
app.put('/update-todo/:todoId', authenticateToken, async (req, res) => {
    const { id } = req.user;
    const {todoId}=req.params
    const {title, status } = req.body;

    if (!todoId || (!title && !status)) {
        return res.status(400).json({ msg: 'Please provide todoId and at least one field to update title or status.' });
    }

    let query = `UPDATE todo SET `;
    const values = [];

    if (title) {
        query += `title = ?, `;
        values.push(title);
    }
    if (status) {
        query += `status = ?, `;
        values.push(status);
    }
    query = query.slice(0, -2); // last comma removing
    query += ` WHERE id = ? AND user_id = ?`;
    values.push(todoId, id);

    try {
        const response = await db.run(query, values);
        if (response.changes > 0) {
            return res.status(200).json({ msg: 'To-do updated successfully.' });
        }
    } catch (error) {
        return res.status(500).json({ msg: 'An error occurred.', error: error.message });
    }
});

// delete todo
app.delete('/delete-todo/:todoId', authenticateToken, async (req, res) => {
    const { id } = req.user; 
    const { todoId } = req.params; 

    const query = `DELETE FROM todo WHERE id = ? AND user_id = ?`;
    try {
        const response = await db.run(query, [todoId, id]);
        if (response.changes > 0) {
            return res.status(200).json({ msg: 'To-do deleted successfully.' });
        }
    } catch (error) {
        return res.status(500).json({ msg: 'An error occurred.', error: error.message });
    }
});


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})