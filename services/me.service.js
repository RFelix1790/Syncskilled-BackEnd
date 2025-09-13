export function meService(req, res) {
  return res.json({ user: req.user });
}
