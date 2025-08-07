import PropTypes from "prop-types";

function List(props) {

    const category = props.category;
    const listItems = props.items ? props.items.map(item => <li key={item.id}>{item.id}. {item.name}: {item.calories}</li>) : <li>Empty</li>;

    return(
        <>
            <h3 className="list-category">{category}</h3>
            <ul className="list-items">{listItems}</ul>
        </>
    );
}

List.propTypes = {
    category: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.number, name: PropTypes.string, calories: PropTypes.number}))
}

List.defaultProps = {
    category: "Category",
    items: [{
        id: 404,
        name: "Name",
        calories: 0
    }]
}

export default List