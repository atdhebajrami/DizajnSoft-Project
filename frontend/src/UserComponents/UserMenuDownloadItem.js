import React from "react";

const UserMenuDownloadItem = ({ itemData }) => {
    return(
        <div className="UserMenuItem">
            <div className="UserMenuItemContainer">
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

export default UserMenuDownloadItem;