import React from "react";

const UserMenuItem = ({ itemData, history, saveText }) => {

    const itemSelected = () => {
        let item = {
            id: itemData.id,
            image: itemData.image,
            title: itemData.title,
            author: itemData.author,
            description: itemData.description,
            price: itemData.price,
            reviews: itemData.reviews,
            saveText: saveText
        }
        localStorage.setItem("SelectedItem", JSON.stringify(item));
        history.push("/User/SelectedItem");
    }

    return(
        <div className="UserMenuItem">
            <div className="UserMenuItemContainer" onClick={() => itemSelected()}>
                <div className="UserMenuItemImageBox">
                    <img className="UserMenuItemImage" src={itemData.image} alt="Book Image"/>
                </div>
                <div className="UserMenuItemContent">
                    <h5 className="UserMenuItemTitle">{itemData.title}</h5>
                    <h6 className="UserMenuItemAuthor">by {itemData.author}</h6>
                </div>
            </div>
        </div>
    );
}

export default UserMenuItem;