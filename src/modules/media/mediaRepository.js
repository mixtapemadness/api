'use strict'
class MediasRepository {
  constructor (wp) {
    this.wp = wp
  }

  // mutate Obj to levelUp nested Fields Recieved From wp-Api
  MutateMediaObj(obj) {
    let medium_large = null
    const { media_details } = obj

    if (media_details && media_details.sizes) {
      if (media_details.sizes.medium_large) {
        medium_large = media_details.sizes.medium_large.source_url
      } else if (media_details.sizes.medium) {
        medium_large = media_details.sizes.medium.source_url
      }
    }
    return Object.assign({}, obj, {
      guid: obj && obj.guid && obj.guid.rendered && obj.guid.rendered,
      title: obj.title.rendered,
      description: obj.description.rendered,
      caption: obj.caption.rendered,
      full:
        obj.media_details &&
        obj.media_details.sizes &&
        obj.media_details.sizes.full &&
        obj.media_details.sizes.full.source_url &&
        obj.media_details.sizes.full.source_url,

      medium:
        obj.media_details &&
        obj.media_details.sizes &&
        obj.media_details.sizes.medium &&
        obj.media_details.sizes.medium.source_url &&
        obj.media_details.sizes.medium.source_url
          ? obj.media_details.sizes.medium.source_url
          : obj.media_details &&
          obj.media_details.sizes &&
          obj.media_details.sizes.full &&
          obj.media_details.sizes.full.source_url &&
          obj.media_details.sizes.full.source_url,

      large:
        obj.media_details &&
        obj.media_details.sizes &&
        obj.media_details.sizes.large &&
        obj.media_details.sizes.large.source_url &&
        obj.media_details.sizes.large.source_url
          ? obj.media_details.sizes.large.source_url
          : obj.media_details &&
          obj.media_details.sizes &&
          obj.media_details.sizes.full &&
          obj.media_details.sizes.full.source_url &&
          obj.media_details.sizes.full.source_url,

      medium_large,

      thumbnail:
        obj.media_details &&
        obj.media_details.sizes &&
        obj.media_details.sizes.thumbnail &&
        obj.media_details.sizes.thumbnail.source_url &&
        obj.media_details.sizes.thumbnail.source_url,

      featured_image:
        obj.media_details &&
        obj.media_details.sizes &&
        obj.media_details.sizes &&
        obj.media_details.sizes['featured-image'] &&
        obj.media_details.sizes['featured-image'].source_url
          ? obj.media_details.sizes['featured-image'].source_url
          : obj.media_details &&
            obj.media_details.sizes &&
            obj.media_details.sizes.full &&
            obj.media_details.sizes.full.source_url &&
            obj.media_details.sizes.full.source_url
    })
  }

  async getMedia() {
    try {
      const media = await this.wp.media()
      return media.map(item => this.MutateMediaObj(item))
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async getMediaById(id) {
    try {
      if (id && id > -1) {
        const media = await this.wp.media().id(id)
        return this.MutateMediaObj(media)
      }
    } catch (e) {
      return null
    }
  }

  async getMediaByParent(id) {
    try {
      const media = await this.wp.media().param('parent', id)
      return media.map(item => this.MutateMediaObj(item))
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

module.exports = MediasRepository
