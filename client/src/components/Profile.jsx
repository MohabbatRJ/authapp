import { Link, useNavigate } from "react-router-dom"
import avatar from '../assets/profile.png'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { profileValidation } from "../helper/validate"
import { convertToBase64 } from "../helper/convert"
import { useState } from "react"
import useFetch from "../hooks/fetch.hook"

import styles from '../styles/Username.module.css'
import extend from '../styles/Profile.module.css'
import { updateUser } from "../helper/helper"

export default function Profile() {

  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch()
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || '',
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...!',
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      });
    }
  })

  // formik does not support file upload 
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  // logout handler function
  function userLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>

  return (
    <div className="container mx-auto">

      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className=" flex justify-center items-center h-screen">

        <div className={`${styles.glass} ${extend.glass}`} style={{ width: "45%", paddingTop: '3em' }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-3/4 text-center text-gray-500">You can update the details.</span>
          </div>

          <form onSubmit={formik.handleSubmit} className="py-1">
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={apiData?.profile || file || avatar} alt="avatar" className={`${styles.profile_img} ${extend.profile_img}`} />
              </label>

              <input type="file" id="profile" name="profile" onChange={onUpload} />
            </div>

            <div className="textbox flex flex-col items-center gap-6">

              <div className={extend.name}>
                <input type="text" placeholder="First Name" className={`${styles.textbox} ${extend.textbox}`} {...formik.getFieldProps('firstName')} />
                <input type="text" placeholder="Last Name" className={`${styles.textbox} ${extend.textbox}`} {...formik.getFieldProps('lastName')} />
              </div>

              <div className={extend.name}>
                <input type="text" placeholder="Mobile No." className={`${styles.textbox} ${extend.textbox}`} {...formik.getFieldProps('mobile')} />
                <input type="text" placeholder="Email" className={`${styles.textbox} ${extend.textbox}`} {...formik.getFieldProps('email')} />
              </div>
              <div className={extend.name}>
                <input type="text" placeholder="Address" className={`${styles.textbox} ${extend.textbox} w-full`} {...formik.getFieldProps('address')} />
              </div>
              <button className={`${styles.btn} ${extend.textbox}`} type="submit">Update</button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">come back later? <Link onClick={userLogout} className={styles.btn_link} to="/">Logout</Link> </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
