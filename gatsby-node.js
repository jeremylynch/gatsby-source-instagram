const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const axios = require('axios')
const fetch = require(`./fetch`)

// Replace ACCESS_TOKEN with your Instagram token

const instagram_api = "https://api.instagram.com/v1/users/self/media/recent/?access_token=";
const image_count = 1

exports.sourceNodes = async ({ boundActionCreators, store, cache }, {accessToken}) => {
  const { createNode, createNodeField } = boundActionCreators

  let API_URI = instagram_api + accessToken + "&count=" + image_count
  // Fetch data
  console.log("Fetching Instagram Data")
  let data = await fetch({uri: API_URI})

  // use for loop for async/await support
  for (const image of data.data) {
    let fileNode
    try {
      fileNode = await createRemoteFileNode({
        // Add split so createRemoteFileNode creates the correct extension
        // (Instagram sometimes adds additional url params causing this bug)
        url: image.images.standard_resolution.url.split('?')[0],
        cache,
        store,
        createNode,
      })
      const fields = [
        ['InstagramImage', 'true'],
        ['link', image.link],
        ['created', image.created_time],
        ['caption', image.caption.text],
        ['likes', image.likes.count]
      ]
      fields.map(async (field, i) => (
        await createNodeField({
          node: fileNode,
          name: field[0],
          value: field[1],
        })
      ))
    } catch (error) {
      console.warn('error creating node', error)
    }
  }
  console.log("Finished Instagram")
  return
}
