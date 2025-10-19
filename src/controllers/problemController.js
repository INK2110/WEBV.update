import pool from "../dbConfig/db.js";


export const getProblemlist = async (req, res) =>  {
  

  try {
    const result = await pool.query(`
      SELECT 
        p.problemid,
        p.title,
        p.description,
        p.createat,
        p.location,
        CONCAT (u.firstname, ' ', u.lastname) AS createby,
        c.categoryname,
        s.statusstate,
        d.departmentname,
        sla.prioritylevel,
        p.comment
        FROM Problem p
        JOIN Users u ON p.createby = u.usersid
        JOIN Category c ON p.categoryid = c.categoryid
        JOIN Status s ON p.statusid = s.statusid
        JOIN Department d ON p.departmentid = d.departmentid
        JOIN ServiceLevelAgreement sla ON p.priorityid = sla.priorityid
        ORDER BY p.problemid DESC;
      `);

    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};


export const getProblemlastest = async (req, res) =>  {
  
  try {
    const result = await pool.query(`
      SELECT 
        p.problemid,
        p.title,
        p.description,
        p.description,
        p.createat,
        p.location,
        CONCAT (u.firstname, ' ', u.lastname) AS createby,
        c.categoryname,
        s.statusstate,
        d.departmentname,
        sla.prioritylevel,
        p.comment
      FROM Problem p
      JOIN Users u ON p.createby = u.usersid
      JOIN Category c ON p.categoryid = c.categoryid
      JOIN Status s ON p.statusid = s.statusid
      JOIN Department d ON p.departmentid = d.departmentid
      JOIN ServiceLevelAgreement sla ON p.priorityid = sla.priorityid
      WHERE p.createby = $1
      ORDER BY p.problemid DESC
      LIMIT 3;
    ` , [req.session.user.usersid]);
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getLatestWorkAssignment = async (req, res) =>  {
  
  try {
    const result = await pool.query(`
      SELECT 
        p.problemid,
        p.title,
        p.description,
        p.description,
        p.createat,
        p.location,
        CONCAT (u.firstname, ' ', u.lastname) AS createby,
        c.categoryname,
        s.statusstate,
        d.departmentname,
        sla.prioritylevel,
        p.comment
      FROM workassignment wk
	    JOIN problem p on wk.problemid = p.problemid
      JOIN Users u ON p.createby = u.usersid
	    Join users u2 on u2.usersid = wk.usersid
      JOIN Category c ON p.categoryid = c.categoryid
      JOIN Status s ON p.statusid = s.statusid
      JOIN Department d ON p.departmentid = d.departmentid
      JOIN ServiceLevelAgreement sla ON p.priorityid = sla.priorityid
      WHERE wk.usersid = $1
      ORDER BY wk.assignat DESC
      LIMIT 3
    ` , [req.session.user.usersid]);
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getMyWorkAssignment = async (req, res) =>  {
  try {
      const result = await pool.query(`
      select 
		    p.problemid,
        p.createat,
        p.title,
        c.categoryname,
        CONCAT (u2.firstname, ' ', u2.lastname) AS createby,
        p.description,
        d.departmentname,
        s.statusstate,
        sla.prioritylevel,
        p.location,
        wk.assignat,
        sla.resolvetime,
        wk.finishat
      from problem p
      JOIN department d on p.departmentid = d.departmentid
      join status s on p.statusid = s.statusid
      join workassignment wk on p.problemid = wk.problemid
      join category c on p.categoryid = c.categoryid
      join servicelevelagreement sla on p.priorityid = sla.priorityid
      join users u on u.usersid = wk.usersid
	    join users u2 on p.createby = u2.usersid
     
      WHERE wk.usersid = $1 AND s.statusid != 5 AND s.statusid != 4
      ORDER BY wk.assignat DESC;
      ;`, [req.session.user.usersid]);
      res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getMyWorkHistory = async (req, res) =>  {
  try {
      const result = await pool.query(`
      select 
		  p.problemid,
      p.createat,
      p.title,
      c.categoryname,
      CONCAT (u2.firstname, ' ', u2.lastname) AS createby,
      p.description,
      d.departmentname,
      s.statusstate,
      sla.prioritylevel,
      p.location,
      wk.assignat,
      sla.resolvetime,
      wk.finishat
      from problem p
      JOIN department d on p.departmentid = d.departmentid
      join status s on p.statusid = s.statusid
      join workassignment wk on p.problemid = wk.problemid
      join category c on p.categoryid = c.categoryid
      join servicelevelagreement sla on p.priorityid = sla.priorityid
      join users u on u.usersid = wk.usersid
	    join users u2 on p.createby = u2.usersid
     
      WHERE wk.usersid = $1
      ORDER BY p.problemid DESC
      ;`, [req.session.user.usersid]);
      res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getMyHistory = async (req, res) =>  {
  try {
    const result = await pool.query(`
      SELECT 
        p.problemid,
        p.title,
        p.description,
        p.description,
        p.createat,
        p.location,
        CONCAT (u.firstname, ' ', u.lastname) AS createby,
        c.categoryname,
        s.statusstate,
        d.departmentname,
        sla.prioritylevel,
        p.comment
      FROM Problem p
      JOIN Users u ON p.createby = u.usersid
      JOIN Category c ON p.categoryid = c.categoryid
      JOIN Status s ON p.statusid = s.statusid
      JOIN Department d ON p.departmentid = d.departmentid
      JOIN ServiceLevelAgreement sla ON p.priorityid = sla.priorityid
      WHERE p.createby = $1
      ORDER BY p.problemid DESC
    ` , [req.session.user.usersid]);
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const addProblem = async (req, res) => {

  const { title, description, categoryid, statusid, departmentid, priorityid, location, comment } = req.body;
  const createby = req.session.user.usersid; // ดึงจาก session
  const createat = new Date();// เวลาปัจจุบัน
  try {
    await pool.query(
    `INSERT INTO Problem
    (title, description, createby, categoryid, createat, statusid, departmentid, priorityid, location, comment)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [title, description, createby, categoryid, createat, statusid, departmentid, priorityid, location, comment]
  );

    res.json({ success: true });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  } 

};
//====================/
export const adduser = async (req,res) => {
  try {
    const { firstname, lastname, email, password, teamId, roleId } = req.body;
    const createat = new Date();// เวลาปัจจุบัน
    const result = await pool.query(`
      INSERT INTO users (firstname, lastname, usersemail, password, teamid, roleid,createat)
      VALUES ($1, $2, $3,crypt($4, gen_salt('bf')), $5, $6,NOW())
      RETURNING *;
    `, [firstname, lastname, email, password, teamId, roleId]);
    res.json({ success: true, userId: result.rows[0].id });
  } catch (err) {
    console.error("❌ Error inserting user:", err);
    res.json({ success: false, message: err.message });
  }
};

export const checkSession = (req, res) => {
  if (req.session && req.session.user) {
      return res.json({ loggedIn: true, user: req.session.user });
  }
    res.json({ loggedIn: false });
}

export const getCategory = async (req, res) => {
   try {
    const result = await pool.query("SELECT categoryid, categoryname FROM category");
      console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
      console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
};

export const getDepartment = async (req, res) => {
  try {
    const result = await pool.query("SELECT departmentid, departmentname FROM department");
      console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
      console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
};

export const getPriority = async (req, res) => {
  try {
      const result = await pool.query("SELECT priorityid, prioritylevel FROM servicelevelagreement");
        console.log(result.rows);
      res.json(result.rows);
    } catch (err) {
        console.error(err);
      res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
};

export const getStatus = async (req,res) => {
  try {
      const result = await pool.query("SELECT statusid, statusstate FROM status");
        console.log(result.rows);
      res.json(result.rows);
    } catch (err) {
        console.error(err);
      res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
};

export const getTeam = async (req,res) => {
  try {
      const result = await pool.query("SELECT teamid, teamname FROM teams");
        console.log(result.rows);
      res.json(result.rows);
    } catch (err) {
        console.error(err);
      res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
};

export const getRole = async (req,res) => {
  try {
      const result = await pool.query("SELECT roleid, rolename FROM role");
        console.log(result.rows);
      res.json(result.rows);
    } catch (err) {
        console.error(err);
      res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
};

export const acceptWorkAssignment = async (req, res) => {
  const problemid = req.params.id;
  const status = req.body.statusstate; 
  const workby = req.session.user.usersid; 

  

  try {
  await pool.query("BEGIN");
  
  if(status == 'New / สร้างใหม่') {
    await pool.query(
      `UPDATE Problem
      SET statusid = 2
      WHERE problemid = $1`,
      [problemid]
    );

    await pool.query(`
      INSERT INTO WorkAssignment (problemid, usersid, assignat)
      VALUES ($1,$2, NOW())
      `, [problemid, workby]
    );
  } else {
      await pool.query(
        `INSERT INTO WorkAssignment (problemid, usersid, assignat)
        VALUES ($1,$2, NOW())
        `,
        [problemid, workby]
      );
    }

  await pool.query("COMMIT");

  res.json({ success: true});
  } catch (err) {
    await pool.query("ROLLBACK");
    
    if (err.code === '23505') {
      // 23505 = unique_violation
      res.status(400).json({ success: false, message: "คุณเคยรับงานนี้แล้ว" });
    } else {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
    }
  }
};


export const cancelWorkAssignment = async (req, res) => {
  const problemid = req.params.id;
  const deleteby = req.session.user.usersid; 
  console.log("problemid: ", problemid);
  try {
    await pool.query(`
      delete from workassignment 
      where usersid = $1 and problemid = $2;
      `, [deleteby, problemid]);
      res.json({ success: true });
  }catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

export const updateProblem = async (req, res) => {
    try{
      
      const finishat = req.body.finishat; //from finishBtn
      console.log(finishat);
      if(finishat){
        await pool.query(`
          UPDATE problem p
          SET statusid = $1
          FROM workassignment w
          WHERE p.problemid = w.problemid
            AND p.problemid = $2;
        `, [req.body.statusid, req.params.id]);

        await pool.query(`
          UPDATE workassignment
          SET finishat = $1
          WHERE problemid = $2;
        `, [finishat, req.params.id]);

      } else {
          await pool.query(`
          UPDATE Problem
          SET statusid = $1
          WHERE problemid = $2
          `, [req.body.statusid, req.params.id]);
            
      }
      
      

      res.json({ success: true });
    }catch(err){
      console.error(err);
      res.status(500).json({ success: false, message: "Database error" });
    }
};

// export const getDropdownWorker = async (req,res) => {
//     try {
//       const problemId = req.params.problemId;
//       const result = await pool.query(
//         select CONCAT(u.firstname ,' ', u.lastname) AS assignby
//         FROM users u
//         Join workassignment wk on u.usersid = wk.usersid
//         where wk.problemid = $1 ;
//         ,[problemId]);
//     } catch (error) {
//       res.status(500).json({ success: false, message: "Database error" });
//     }
// }