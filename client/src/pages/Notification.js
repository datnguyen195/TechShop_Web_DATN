import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  apiAddNotification,
  apiGetNotification,
  apiDeleteNotification,
} from "../apis"; // Assuming apiDeleteNotification is available
import Swal from "sweetalert2";
import moment from "moment";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null); // For viewing details
  const { register, handleSubmit, reset } = useForm();

  // Function to toggle modal visibility
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const fetchNotifi = async () => {
    try {
      const response = await apiGetNotification();
      if (response.success) {
        setNotifications(response.notifications);
      } else {
        console.error("Failed to fetch notifications:", response.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này không?")) {
      try {
        const response = await apiDeleteNotification(id); // Call API to delete notification
        if (response.success) {
          setNotifications((prev) =>
            prev.filter((notification) => notification._id !== id)
          );
          Swal.fire({
            icon: "success",
            title: "Xóa thành công.",
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          console.error("Failed to delete notification:", response.message);
        }
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("message", data.message);
    if (data.avatar[0]) {
      formData.append("imageUrl", data.avatar[0]);
    }

    try {
      const response = await apiAddNotification(formData);
      if (response.success) {
        fetchNotifi(); // Refresh notifications list after adding new one
        toggleModal(); // Close modal on success
        reset(); // Reset form fields
        Swal.fire({
          icon: "success",
          title: "Thêm thành công.",
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        console.error("Failed to post notification:", response.message);
        Swal.fire({
          icon: "error",
          title: "Đã xảy ra lỗi.",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } catch (error) {
      console.error("Error posting notification:", error);
    }
  };

  const handleViewDetails = (id) => {
    const notification = notifications.find((notif) => notif._id === id);
    setSelectedNotification(notification); // Set the selected notification details
    setIsDetailModalOpen(true); // Open the details modal
  };

  useEffect(() => {
    fetchNotifi();
  }, []);

  return (
    <div className="w-full">
      <div className="p-4">
        {/* Modal for Adding Notification */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">Thêm thông báo</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    {...register("title", { required: true })}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Thông điệp
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    {...register("message", { required: true })}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="avatar"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ảnh (Tùy chọn)
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    {...register("avatar")}
                    className="mt-1 block w-full text-sm text-gray-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 transition duration-300 mr-2"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                  >
                    Thêm thông báo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Danh sách thông báo</h2>
            <button
              onClick={toggleModal}
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
            >
              {isModalOpen ? "Đóng" : "Thêm thông báo"}
            </button>
          </div>
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className="border-b py-4 flex items-center space-x-4"
              >
                {notification.imageUrl && (
                  <img
                    src={notification.imageUrl}
                    alt={notification.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-600">
                    {moment(notification.createdAt).format("DD / MM / YYYY")}
                  </p>
                </div>
                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(notification._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition duration-300 mr-2"
                >
                  Xem Chi Tiết
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(notification._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal for Viewing Details */}
        {isDetailModalOpen && selectedNotification && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">
                {selectedNotification.title}
              </h2>
              <div className="flex justify-center mb-4">
                {selectedNotification.imageUrl && (
                  <img
                    src={selectedNotification.imageUrl}
                    alt={selectedNotification.title}
                    className="w-2/5 h-auto object-cover rounded-md p-2"
                  />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {selectedNotification.message}
              </p>
              <p className="text-sm text-gray-600">
                {moment(selectedNotification.createdAt).format(
                  "DD / MM / YYYY"
                )}
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsDetailModalOpen(false)} // Close the modal
                  className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 transition duration-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
