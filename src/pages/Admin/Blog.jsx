import React, { useEffect, useState } from 'react';
import { INIT_PAGING } from '../../utilities/common';
import { toast } from 'react-toastify';
import { PagingPage } from '../../components/common/PagingCpn';
import { BLOG_SERVICE } from '../../utilities/users-api';
// import { BLOG_SERVICE } from '../../services/blog'; // Import hàm BLOG_SERVICE từ file service tương ứng

const BlogPage = ({ user }) => {
	const [paging, setPaging] = useState(INIT_PAGING); // Định nghĩa biến paging ở đầu hàm BlogPage

	const [locationDataList, setLocationDataList] = useState([]); // Thêm state để lưu trữ danh sách các địa điểm

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await BLOG_SERVICE.getList();
				if (response && response.data && response.status === 200) {
					const locationDataList = response.data.companies?.map(item => ({
						locationName: item.locationName,
						ownUser: item.ownUser,
						address: item.address,
						sub_category: item.sub_category
					})) || [];
					setLocationDataList(locationDataList);
				} else {
					toast.error('Lỗi khi lấy danh sách địa điểm');
				}
			} catch (error) {
				console.error('Lỗi khi lấy dữ liệu địa điểm:', error);
				toast.error('Đã xảy ra lỗi khi lấy danh sách địa điểm');
			}
		};

		fetchData();
	}, []);

	// const handleDelete = async (event, id) => {
	// 	event.preventDefault();
	// 	const response = await BLOG_SERVICE.deleteData(id);
	// 	console.log("response user--------> ", response)
	// 	if (response?.status == 200) {
	// 		toast.success(`Xóa thành công`)
	// 		await getLocationDataList({ page: 1, page_size: INIT_PAGING.page_size });
	// 	} else {
	// 		toast.success(`Xóa thất bại`)
	// 	}
	// }

	// useEffect(() => {
	// 	getLocationDataList(); // Gọi hàm getLocationDataList khi component được render
	// }, []);

	return (
<>
  <div
    className="hero h-80"
    style={{
      backgroundImage: `url("https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
    }}
  >
  </div>
  <h1 className="mb-4 mt-4 text-5xl text-center font-bold">
    Danh sách cửa hàng
  </h1>
  <div className="flex flex-col gap-10 mx-32 mt-14">
    <div className="rounded-sm px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black xl:pl-11">
                Tên nhà hàng
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                Doanh nghiệp
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                Địa chỉ
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black ">
                Loại hình
              </th>
              <th className="py-4 px-4 font-medium text-black justify-center flex text-nowrap">
                Chỉnh sửa
              </th>
            </tr>
          </thead>
          <tbody>
            {locationDataList.map((item, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 xl:pl-11">
                  <div className={'flex'}>
                    <div className={'cursor-pointer hover:text-sky-500'}>
                      <h5 className="font-medium text-black hover:text-sky-500">
                        {item.locationName}
                      </h5>
                    </div>
                  </div>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 ">
                  {item.ownUser}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 ">
                  <p className="text-sm">{item.address}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 ">
                  {item.sub_category}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 ">
                  <div className="flex items-center space-x-3.5 justify-center">
                    <button className="hover:text-primary" onClick={(e) => handleDelete(e, item._id)}>
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Mã SVG */}
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 py-5" >
        <PagingPage
          paging={paging}
          setPaging={setPaging}
          onPageChange={(e) =>
          {
            fetchData({ page: e, page_size: paging.page_size })
          }} />
      </div>
    </div>
  </div>
</>

	);
};

export default BlogPage;
