import React from 'react'
import { StyleSheet, View, StatusBar } from 'react-native'
import { observer } from 'mobx-react'
import store from './Store'
import { TNStoriesTray } from '../../truly-native'
import FullStoriesModal from '../FullStoriesModal/FullStoriesModal'

@observer
export default class extends React.Component {
  componentDidMount() {
    if (this.props.stories?.length != 0 || this.props.userStories) {
      store.updateUserStory(this.props.userStories)
      store.setSories(this.props.stories)
    }
  }

  componentDidUpdate(prevProps) {
    const { stories, userStories } = this.props
    if (
      stories !== prevProps.stories ||
      userStories !== prevProps.userStories
    ) {
      store.updateUserStory(this.props.userStories)
      store.setSories(this.props.stories)
    }
  }

  openCarousel = (refIndex, index) => {
    // store.openCarousel(index, {});
    const avatarSize = 70
    refIndex.current.measure((ox, oy, width, height, px, py) => {
      const offset = {
        top: py + avatarSize / 2,
        left: px + avatarSize / 2,
      }

      store.openCarousel(index, offset)
    })
  }

  onStoryItemPress = (item, index, refIndex) => {
    store.moveStories()
    this.openCarousel(refIndex, index)
  }

  onUserItemPress = (shouldOpenCamera, refIndex, index) => {
    if (shouldOpenCamera) {
      this.props.onUserItemPress(shouldOpenCamera)
    } else {
      store.setUserStory()
      this.openCarousel(refIndex, index)
    }
  }

  onClose = () => {
    store.dismissCarousel()
    store.setUserStory()
    StatusBar.setHidden(false)
  }

  render() {
    const shouldOpenCamera =
      store.userStory.items && store.userStory.items.length > 0 ? false : true
    return (
      <View style={styles.container}>
        <TNStoriesTray
          data={store.stories.length === 1 ? store.storiesCopy : store.stories}
          userItemShouldOpenCamera={shouldOpenCamera}
          displayUserItem={true}
          onStoryItemPress={this.onStoryItemPress}
          onUserItemPress={this.onUserItemPress}
          user={this.props.user}
          userStoryTitle={shouldOpenCamera ? 'Add Story' : 'My Story'}
          displayVerifiedBadge={true}
          onListEndReached={this.props.onStoriesListEndReached}
        />
        <FullStoriesModal
          isModalOpen={store.carouselOpen}
          onClosed={this.onClose}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
