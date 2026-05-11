import { useState, useEffect } from 'react';
import Loading from '../../Components/Loading/Loading';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export async function isCategoryAvailable(id) {
  try {
    const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products?category[in]=${id}`);
    return data.results > 0;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    return false;
  }
}

async function fetchAvailableCategories() {
  try {
    const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
    const categories = data.data;

    const availableCategories = await Promise.all(
      categories.map(async (category) => {
        const available = await isCategoryAvailable(category._id);
        return {
          id: category._id,
          name: category.name,
          image: category.image,
          available
        };
      })
    );

    return availableCategories;
  } catch (error) {
    console.error(error?.response?.data?.message || error.message);
    return [];
  }
}

export default function Categories() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableCategories().then((data) => {
      setCategories(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="relative mt-2 py-4 pb-10">
        <h2 className="text-focus text-center text-lg font-semibold mt-2 mb-2 py-2 w-[95%] border-y border-gray-200">
          Shop by category
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4">
        {categories.map((categ) => (
          <div
            key={categ.id}
            onClick={() => navigate(`/subcategories/${categ.id}`)}
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="relative bg-white rounded-xl shadow overflow-hidden group-hover:scale-[1.03] duration-500">
              {!categ.available && (
                <span className="absolute top-1/2 text-white text-center w-full bg-red-600/40">
                  OUT OF STOCK
                </span>
              )}
              <img src={categ.image} alt={categ.name} className="w-full h-50 object-cover rounded-lg"/>
              
            </div>
            <h5 className="text-sm font-bold text-green mt-3 text-center">
              {categ.name}
            </h5>
          </div>
        ))}
      </div>
    </div>
  );
}
