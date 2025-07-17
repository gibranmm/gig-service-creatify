const db = require("../config/db");

// Get all gigs
exports.getAllGigs = (req, res) => {
  const sql = `
    SELECT g.*, c.name AS category_name
    FROM gigs g
    LEFT JOIN categories c ON g.category_id = c.id
    ORDER BY g.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const gigs = results.map(row => {
      let images = [];
      try { images = JSON.parse(row.image) || []; } catch (e) {}
      return { ...row, images };
    });

    res.json(gigs);
  });
};

// Get single gig by ID
exports.getGigById = (req, res) => {
  const gigId = req.params.id;

  const sql = `
    SELECT g.*, c.name AS category_name
    FROM gigs g
    LEFT JOIN categories c ON g.category_id = c.id
    WHERE g.id = ?
  `;
  db.query(sql, [gigId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ message: "Gig not found" });

    let images = [];
    try { images = JSON.parse(rows[0].image) || []; } catch (e) {}

    res.json({ ...rows[0], images });
  });
};

// Create a new gig
exports.createGig = (req, res) => {
  const {
    user_id,
    user_name,
    category_id,
    title,
    description,
    price,
    delivery_time,
  } = req.body;
  const imageFiles = req.files || [];

  const imagePaths = imageFiles.map(file =>
    `https://gig-service-creatify-production.up.railway.app/uploads/${file.filename}`
  );
  const imagesJson = JSON.stringify(imagePaths);

  if (!user_id || !user_name || !title || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  const sql = `
    INSERT INTO gigs (
      user_id, user_name, category_id, title, slug, description, price, delivery_time, image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      user_id,
      user_name,
      category_id,
      title,
      slug,
      description,
      price,
      delivery_time,
      imagesJson,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ message: "Gig created", id: result.insertId, images: imagePaths });
    }
  );
};

// Update a gig (gabung gambar lama + baru)
exports.updateGig = (req, res) => {
  const gigId = req.params.id;
  const { title, description, price, delivery_time, category_id } = req.body;
  const imageFiles = req.files || [];

  const newImagePaths = imageFiles.map(file =>
    `https://gig-service-creatify-production.up.railway.app/uploads/${file.filename}`
  );

  const getGigSql = "SELECT image FROM gigs WHERE id = ?";
  db.query(getGigSql, [gigId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Gig not found" });

    let oldImages = [];
    try { oldImages = JSON.parse(results[0].image) || []; } catch (e) {}

    const combinedImages = [...oldImages, ...newImagePaths];
    const imagesJson = JSON.stringify(combinedImages);

    const updateSql = `
      UPDATE gigs
      SET title = ?, description = ?, price = ?, delivery_time = ?, image = ?, category_id = ?
      WHERE id = ?
    `;
    db.query(
      updateSql,
      [title, description, price, delivery_time, imagesJson, category_id, gigId],
      (updateErr, result) => {
        if (updateErr) return res.status(500).json({ error: updateErr.message });
        res.json({ message: "Gig updated", images: combinedImages });
      }
    );
  });
};

// Delete a gig
exports.deleteGig = (req, res) => {
  const gigId = req.params.id;

  db.query("DELETE FROM gigs WHERE id = ?", [gigId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Gig not found" });

    res.json({ message: "Gig deleted" });
  });
};
