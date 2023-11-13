// API URL kis prakar se data fetch karne ke liye hai, woh yahan di gayi hai.
const apiUrl ="https://crudcrud.com/api/6be4c199a2384f6d88af4b433a088727/products";

// HTML form aur product list ko JavaScript ke variables se connect kiya gaya hai.
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const electronicsTable = document.getElementById("electronicsTable").querySelector("tbody");
const entertainmentTable = document.getElementById("entertainmentTable").querySelector("tbody");
const educationTable = document.getElementById("educationTable").querySelector("tbody");
const groceryTable = document.getElementById("groceryTable").querySelector("tbody");
const softwareTable = document.getElementById("softwareTable").querySelector("tbody");

/*async ek JavaScript keyword hai jo asynchronous programming ko handle
 karne ke liye istemal hota hai. Asynchronous programming ka matlab hota
  hai ki aap ek kaam ko shuru karte hain, lekin us kaam ke khatam hone ka
   intezar nahi karte aur simultaneously doosre kaam ko bhi shuru kar dete hain.*/

// Products fetch karne ke liye ek async function ka upayog kiya gaya hai.
async function fetchProducts() {//Read Opration
  try {
    /*await ek JavaScript keyword hai jo async functions ke andar asynchronous
         operations ke response ka wait karne ke liye istemal hota hai. await ka
          upayog promises ke sath kiya jata hai. Promises, asynchronous operations
           ke results ko handle karne ke liye ek standard way provide karte hain*/

    // API se data fetch karne ki koshish ki ja rahi hai.
    const response = await fetch(apiUrl);
    // Agar response sahi aaya hai (status 200), toh us data ko JSON mein convert kiya jata hai.
    if (!response.ok) {
      throw new Error("Error fetching products");
    }

    const data = await response.json();

   /*Yahan har product category ke table ko khali kar diya jata hai taki new data sahi se dikhaya ja sake.*/
    electronicsTable.innerHTML = "";
    entertainmentTable.innerHTML = "";
    educationTable.innerHTML = "";
    groceryTable.innerHTML = "";
    softwareTable.innerHTML = "";

    /*
    const productItems = data.map((product) => createProductElement(product));

productItems.forEach((productItem) => {
    const category = productItem.firstChild.lastChild.textContent.trim();

    switch (category) {
        case 'electronics':
            electronicsTable.appendChild(productItem);
            break;
        case 'entertainment':
            entertainmentTable.appendChild(productItem);
            break;
        case 'education':
            educationTable.appendChild(productItem);
            break;
        case 'grocery':
            groceryTable.appendChild(productItem);
            break;
        case 'software':
            softwareTable.appendChild(productItem);
            break;
        default:
            console.error('Invalid product category');
    }
});

        */
    // Har product ke liye ek HTML element create kiya jata hai.
    data.forEach((product) => {
      const productItem = createProductElement(product);
      /*Yahan har product ke liye ek HTML element create kiya jata hai 
      createProductElement function ke through, aur phir us element ko
       sahi category ke table mein add kiya jata hai.*/

      if (product.productCategory === "electronics") {
        electronicsTable.appendChild(productItem);
      } else if (product.productCategory === "entertainment") {
        entertainmentTable.appendChild(productItem);
      } else if (product.productCategory === "education") {
        educationTable.appendChild(productItem);
      } else if (product.productCategory === "grocery") {
        groceryTable.appendChild(productItem);
      } else if (product.productCategory === "software") {
        softwareTable.appendChild(productItem);
      }
    });
  } catch (error) {
    console.error(error);
  }
}
// Ek product element create karne ke liye ek function ka upayog kiya gaya hai.
function createProductElement(product) {
  const productItem = document.createElement("div");
  // Product ke details ko HTML mein display kiya jata hai.
  productItem.innerHTML = `
        <p>ProductName:<strong>${product.productName}</strong></p>
        <p>Price: $${product.productPrice}</p>
        <p>Category: ${product.productCategory}</p>
    `;

  // "Delete" aur "Edit" buttons create kiye jate hain aur unhe product element ke sath joda jata hai.
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteProduct(product._id));

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => editProduct(product));

  productItem.appendChild(deleteButton);
  productItem.appendChild(editButton);

  return productItem;
}

// Ek naya product add karne ke liye ek async function ka upayog kiya gaya hai.
async function addProduct(product) {// Create opration
  try {
    // API ke madhyam se naya product POST request ke sath bheja jata hai.
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error("Error adding product");
    }

    // Product list ko refresh kiya jata hai aur form clear kiya jata hai.
    fetchProducts();
    productForm.reset();
  } catch (error) {
    console.error(error);
  }
}

// Ek product ko delete karne ke liye async function ka upayog kiya gaya hai.

// const axios=require('axios');

async function deleteProduct(productId) {//Delete Opration
  try {
    // API ke madhyam se product DELETE request ke sath delete kiya jata hai.
    const response = await fetch(`${apiUrl}/${productId}`, {
      method: "DELETE",
    });
    /* const response = await axios.delete(`${apiUrl}/${productId}`); */
    if (!response.ok) {
      throw new Error("Error deleting product");
    }

    // Product list ko refresh kiya jata hai.
    fetchProducts();
  } catch (error) {
    console.error(error);
  }
}

// Ek product ko edit karne ke liye async function ka upayog kiya gaya hai.
async function editProduct(product) {//Update Opration

  // User se product ke details ko edit karne ke liye input liya jata hai.
  const updatedName = prompt("Edit Product Name:", product.productName);
  const updatedPrice = prompt("Edit Product Price:", product.productPrice);
  // const updatedCategory = prompt('Edit Product Category:', product.productCategory);

  // Agar user ne input diya hai, toh product details update ki jati hai.
  if (
    updatedName !== null &&
    updatedPrice !== null /* && updatedCategory !== null*/
  ) {
    const updatedProduct = {
      productName: updatedName,
      productPrice: parseFloat(updatedPrice),
      // productCategory: updatedCategory,
      productCategory: product.productCategory,
    };

    try {
      // API ke madhyam se updated product PUT request ke sath bheja jata hai.
      const response = await fetch(`${apiUrl}/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) {
        throw new Error("Error updating product");
      }

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  }
}

// Form submit event par rok lagakar naya product add kiya jata hai.
productForm.addEventListener("submit", (event) => {
  // Call back function
  event.preventDefault();

  // Form se product details extract ki jati hai.
  const productName = document.getElementById("productName").value;
  const productPrice = document.getElementById("productPrice").value;
  const productCategory = document.getElementById("productCategory").value;

  // Agar saari details available hain, toh ek naya product create kiya jata hai.
  if (productName && productPrice && productCategory) {
    const product = {
      productName,
      productPrice: parseFloat(productPrice),
      productCategory,
    };

    // Add Product function ka upayog kiya jata hai.
    addProduct(product);
  }
});

// Page load par products fetch kiya jata hai.
fetchProducts();
