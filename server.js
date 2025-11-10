const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "454278",
  database: "needsconnect",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

/* ==============================
    NEEDS TABLE ROUTES
   ============================== */

// Get all needs
app.get("/api/needs", (req, res) => {
  const sql = "SELECT * FROM needs ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching needs:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Add new need
app.post("/api/needs", (req, res) => {
  const { name, desc, category, amount, priority, deadline } = req.body;
  if (!name || !category || !amount) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  const sql = `
    INSERT INTO needs (name, description, category, amount_needed, priority, deadline, image_url)
    VALUES (?, ?, ?, ?, ?, ?, 'default.jpg')
  `;
  db.query(
    sql,
    [name, desc || "", category, amount, priority || "Medium", deadline || null],
    (err, result) => {
      if (err) {
        console.error("❌ Error adding need:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Need added successfully", id: result.insertId });
    }
  );
});

// Delete a need
app.delete("/api/needs/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM needs WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("❌ Error deleting need:", err);
      return res.status(500).json({ error: "Failed to delete need" });
    }
    res.json({ message: "Need deleted successfully" });
  });
});

/* ==============================
    DONATION UPDATE ROUTE (FIXED)
   ============================== */
app.post("/api/needs/:id/donate", (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid donation amount" });
  }

  // ✅ Fetch current amount_needed
  const selectSql = "SELECT amount_needed FROM needs WHERE id = ?";
  db.query(selectSql, [id], (err, results) => {
    if (err || results.length === 0) {
      console.error("❌ Error finding need:", err);
      return res.status(404).json({ error: "Need not found" });
    }

    const currentAmount = parseFloat(results[0].amount_needed);
    const donation = parseFloat(amount);
    const newAmount = Math.max(0, currentAmount - donation);

    // ✅ Update amount_needed
    const updateSql = "UPDATE needs SET amount_needed = ? WHERE id = ?";
    db.query(updateSql, [newAmount, id], (updateErr) => {
      if (updateErr) {
        console.error("❌ Error updating donation:", updateErr);
        return res.status(500).json({ error: "Failed to update donation" });
      }

      // ✅ Return updated record for frontend refresh
      db.query("SELECT * FROM needs WHERE id = ?", [id], (fetchErr, updated) => {
        if (fetchErr || updated.length === 0) {
          return res.json({ message: "Donation recorded." });
        }
        res.json({
          message: "Donation recorded successfully",
          updated: updated[0],
        });
      });
    });
  });
});

/* ==============================
    REQUESTS TABLE ROUTES
   ============================== */

// Get all requests
app.get("/api/requests", (req, res) => {
  const sql = "SELECT * FROM requests ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching requests:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Add new request
app.post("/api/requests", (req, res) => {
  const { name, description, category, amount_needed } = req.body;
  if (!name || !category || !amount_needed) {
    return res.status(400).json({ error: "Please fill in all required fields" });
  }

  const sql = `
    INSERT INTO requests (name, description, category, amount_needed, status)
    VALUES (?, ?, ?, ?, 'Pending')
  `;
  db.query(sql, [name, description || "", category, amount_needed], (err, result) => {
    if (err) {
      console.error("❌ Error inserting request:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Request added successfully", id: result.insertId });
  });
});

// ✅ Accept or Decline request
app.put("/api/requests/:id", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  if (!["Accepted", "Declined"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const selectQuery = "SELECT * FROM requests WHERE id = ?";
  db.query(selectQuery, [id], (err, results) => {
    if (err || results.length === 0) {
      console.error("❌ Request not found:", err);
      return res.status(404).json({ error: "Request not found" });
    }

    const request = results[0];
    const updateStatusQuery = "UPDATE requests SET status = ? WHERE id = ?";
    db.query(updateStatusQuery, [status, id], (updErr) => {
      if (updErr) {
        console.error("❌ Error updating request status:", updErr);
        return res.status(500).json({ error: "Failed to update status" });
      }

      if (status === "Accepted") {
        const insertNeedQuery = `
          INSERT INTO needs (name, description, category, amount_needed, priority, deadline, image_url)
          VALUES (?, ?, ?, ?, 'Medium', NULL, 'default.jpg')
        `;
        db.query(insertNeedQuery, [request.name, request.description, request.category, request.amount_needed], (insErr) => {
          if (insErr) {
            console.error("❌ Error adding to needs:", insErr);
            return res.status(500).json({ error: "Failed to add need" });
          }
          res.json({ message: "Request accepted and need added." });
        });
      } else {
        res.json({ message: "Request declined successfully." });
      }
    });
  });
});

// Delete request
app.delete("/api/requests/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM requests WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("❌ Error deleting request:", err);
      return res.status(500).json({ error: "Failed to delete request" });
    }
    res.json({ message: "Request deleted successfully" });
  });
});

/* ==============================
    HELPER ROUTES
   ============================== */

app.get("/api/helper/needs", (req, res) => {
  const sql = "SELECT * FROM needs ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching helper needs:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

/* ==============================
   🚀 START SERVER
   ============================== */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
