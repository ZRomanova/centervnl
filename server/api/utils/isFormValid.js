module.exports = (formData) => {
  if (!formData.page)
    return false

  if (!formData.answers || !formData.answers.length)
    return false

  let name = formData.answers.find(ans => ans.code === "name")?.answer?.toLowerCase()

  if (name && (name.includes("базы компаний") || name.includes("здравствуйте") || name.includes("база лидов")))
    return false

  let tel = formData.answers.find(ans => ans.code === "tel")?.answer?.toLowerCase()

  if (tel && tel == "1")
    return false

  return true
}