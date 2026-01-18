import axios from "axios";

export default async function handler(req, res) {
  try {
    const cookie = req.headers.cookie || "";

    const response = await axios.get(
      "https://server-psi-lake-59.vercel.app/my-bookings",
      {
        headers: { cookie },
        withCredentials: true,
      },
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error("API Proxy Error:", err.message);
    res
      .status(err.response?.status || 500)
      .json({ message: err.response?.data?.message || err.message });
  }
}
