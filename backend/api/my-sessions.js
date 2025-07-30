const Session=require("../models/Session");

const Session = await Session.find({
  createdBy: req.user.id,
  status: { $ne: 'deleted' } // 👈 Only show non-deleted
});