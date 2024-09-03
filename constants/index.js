import categoryIcon from '../assets/friedchickenicon.png';

export const categories = [
    {
        id: 1,
        name: 'Fast Food',
        image: categoryIcon
    },
    {
        id: 2,
        name: 'Sushi',
        image: categoryIcon
    },
    {
        id: 3,
        name: 'Pizza',
        image: categoryIcon
    },
    {
        id: 4,
        name: 'Salads',
        image: categoryIcon
    },
    {
        id: 5,
        name: 'Desserts',
        image: categoryIcon
    },
    {
        id: 6,
        name: 'dog',
        image: categoryIcon
    }
];

export const featured = {
    id: 1,
    title: 'Giảm giá sốc',
    description: 'Giảm giá sốc - Ưu đãi hấp dẫn cho bạn!',
    restaurants: [
      {
        id: 1,
        name: 'Pizza Hut - Lê Văn Sỹ',
        image: categoryIcon,
        description: 'Pizza Hut - Nơi bạn tìm thấy những chiếc pizza ngon tuyệt đỉnh!',
        lat: 10.7627,
        long: 106.6819, // Example coordinates for Ho Chi Minh City
        address: '100 Lê Văn Sỹ, Phường 13, Quận Phú Nhuận, TP. HCM',
        rating: 4.5,
        category: 'Fast food',
        dishes: [
          {
            id: 1,
            name: 'Pizza Pepperoni',
            description: 'Pizza truyền thống với lớp phô mai mozzarella béo ngậy và pepperoni giòn tan.',
            price: 120000,
            image: categoryIcon
          },
          {
            id: 2,
            name: 'Chicken Wings',
            description: 'Cánh gà chiên giòn rụm, đậm đà hương vị.',
            price: 60000,
            image: categoryIcon
          }
        ]
      },
      {
        id: 2,
        name: 'Phở 2000 - Nguyễn Trãi',
        image: categoryIcon, 
        description: 'Phở 2000 - Nơi bạn thưởng thức hương vị phở truyền thống.',
        lat: 10.7833,
        long: 106.6945, // Example coordinates for Ho Chi Minh City
        address: '200 Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, TP. HCM',
        rating: 4.2,
        category: 'Vietnamese',
        dishes: [
          {
            id: 1,
            name: 'Phở bò',
            description: 'Phở bò thơm ngon với nước dùng đậm đà, thịt bò mềm.',
            price: 50000,
            image: categoryIcon
          },
          {
            id: 2,
            name: 'Bún chả',
            description: 'Bún chả Hà Nội với nước chấm đậm đà, thịt chả thơm ngon.',
            price: 45000,
            image: categoryIcon
          }
        ]
      },
      {
        id: 3,
        name: 'KFC - Vincom Center',
        image: categoryIcon,
        description: 'KFC - Nơi bạn tìm thấy món gà rán ngon tuyệt!',
        lat: 23.7754,
        long: 56.6996, 
        address: '72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. HCM',
        rating: 3.8,
        category: 'Fast food',
        dishes: [
          {
            id: 1,
            name: 'Gà rán',
            description: 'Gà rán giòn rụm, đậm đà hương vị.',
            price: 40000,
            image: categoryIcon
          },
          {
            id: 2,
            name: 'Khoai tây chiên',
            description: 'Khoai tây chiên giòn rụm, thơm ngon.',
            price: 25000,
            image: categoryIcon
          }
        ]
      }
    ]
  };