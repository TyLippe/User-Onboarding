import React, {useState, useEffect} from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import './App.css'


const formSchema = Yup.object().shape({
    name: Yup
        .string()
        .required('Must include your name.'),
    email: Yup
        .string()
        .email('Must be a valid email address')
        .required('Must include your email address'),
    password: Yup
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
    terms: Yup
        .boolean()
        .oneOf([true], 'You must accept Terms and Conditions')
})


function Form() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        terms: false
    })

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        terms: ''
    })

    const [buttonDisabled, setButtonDisabled] = useState(true)

    useEffect(() => {
        formSchema.isValid(formData).then(valid => {
            setButtonDisabled(!valid);
        })
    }, [formData])

    const handleChange = e => {
        e.persist()
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.type === 'checkbox'
                    ? e.target.checked
                    : e.target.value
        })
        validateForm(e)
    }

    const handleSubmit = e => {
        e.preventDefault()
        axios
            .post('https://reqres.in/api/users', formData)
            .then(res => {
                console.log(res)
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    terms: false
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    const validateForm = e => {
        Yup
            .reach(formSchema, e.target.name)
            .validate(e.target.value)
            .then((valid) => {
                setErrors({
                    ...errors,
                    [e.target.name]: ''
                })
            })
            .catch(err => {
                setErrors({
                    ...errors,
                    [e.target.name]: err.errors[0]
                })
            })
    }

    return(
        <form id='advForm' onSubmit={handleSubmit}>
            Advanced Form
            <label>
                <input 
                    id='nameInput' 
                    type='string' 
                    name='name' 
                    placeholder='Name' 
                    value={formData.name} 
                    onChange={handleChange}
                />
                {errors.name.length > 0 ? (<p className="error">{errors.name}</p>) : null}
            </label>
            <label>
                <input 
                    id='emailInput' 
                    type='email' 
                    name='email' 
                    placeholder='E-mail' 
                    value={formData.email} 
                    onChange={handleChange}
                />
                {errors.email.length > 0 ? (<p className="error">{errors.email}</p>) : null}
            </label>
            <label>
                <input 
                    id='passwordInput' 
                    type='password' 
                    name='password' 
                    placeholder='Password' 
                    value={formData.password} 
                    onChange={handleChange}
                />
                {errors.password.length > 6 ? (<p className="error">{errors.password}</p>) : null}
            </label>
            <label>
                Do you accept the Terms and Conditions?
                <input 
                    id='termsInput' 
                    type='checkbox' 
                    name='terms'
                    checked={formData.terms}
                    onChange={handleChange}
                />
            </label>
            <button disabled={buttonDisabled}>
                Submit
            </button>
        </form>
    )
}

export default Form