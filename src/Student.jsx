import PropTypes from 'prop-types'

function Student(props) {
    return(
        <p className="student">
            Name: {props.name}
            Age: {props.age}
        </p>
    )
}

Student.propTypes = {
    name: PropTypes.string,
    age: PropTypes.number
}

Student.defaultProps = {
    name: "Guest",
    age: "50"
}

export default Student