import React, { Component } from 'react';
import { StyleProvider, connectStyle } from '@shoutem/theme';
import {
  ScrollView,
  ListView,
  Screen,
  View,
  Divider,
  Title,
} from '@shoutem/ui';
import { Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { NavigationBar } from '@shoutem/ui/navigation';
import { loginRequired } from 'shoutem.auth';
import { closeModal, openInModal, navigateTo } from '@shoutem/core/navigation';
import * as _ from 'lodash';
import { ext } from '../const';
import { NextArticle } from '../components/NextArticle';
import { Review } from '../components/Review';
import { GameStats } from '../components/GameStats';
import { GameBanner } from '../components/GameBanner';
import { GameButtons } from '../components/GameButtons';
import { connect } from 'react-redux';
import {
  addReviews,
  addAReview,
  reviewsLoading,
  reviewsLoaded,
  reviewsFetchError,
  mapReviews,
  initialReviews,
} from '../redux/actions';

export class ReviewLayoutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      rating: 0,
    };
    console.log(this.props);
    this.renderRow = this.renderRow.bind(this);
    this.getReview = this.getReview.bind(this);
    this.addAReview = this.addAReview.bind(this);
    this.openListScreen = this.openListScreen.bind(this);
    // this.getMoreReviews = this.getMoreReviews.bind(this);
    this.mapToMap = this.mapToMap.bind(this);
    this.getReview();
  }
  getRating(data) {
    if (data === null || data === undefined) return 0;
    let rating = 0;
    let count = 0;
    Object.keys(data).map(function (dataKey, index) {
      rating += data[dataKey].rating;
      count++;
    });
    return rating / (count);
  }

  insertIntoReducer(data) {
    const { addReviews, article } = this.props;
    /*
    Object.keys(data).map(function (dataKey, index) {
      addAReview(data[dataKey], dataKey);
    });*/
    addReviews(data, article.id);
  }
  getReview() {
    console.log(this.props);
    const { addReviews, reviewsLoading, reviewsFetchError, reviewsLoaded, mapReviews, reviews, article } = this.props;
    reviewsLoading();
    fetch('https://gamereviewsapp.firebaseio.com' + '/reviews/reviews/' + this.props.article.id + '.json' + '?auth=' + 'JfsF3SK5tnCZPlC3FG1XXKeon7U3LVk0kZ2SZ6Uk')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        //  selected review are saved in responseJson.selReview
        this.insertIntoReducer(responseJson);
        this.setState({
          loading: false,
        });
        reviewsLoaded();
        this.setState({
          rating: this.getRating(this.props.reviews[this.props.article.id]),
          lastReview: this.getLastReview(),
        });
        this.mapToMap();
        //  addFirst(x, this.props.article.id);
        //  addReviews(this.state.data)
      })
      .catch((error) => {
        reviewsFetchError();
        console.log(error);
      });
  }

  getLastReview() {
    const { reviews, article } = this.props;
    const last = Object.keys(reviews[article.id])[Object.keys(reviews[article.id]).length - 1];
    return reviews[article.id][last];
  }
  openListScreen(id) {
    const { navigateTo, article } = this.props;
    const route = {
      screen: ext('ReviewListScreen'),
      title: article.title,
      props: {
        article,
        id,
        getReviews: this.getReview,
      },
    };
    navigateTo(route);
  }

  addAReview() {
    console.log(this.props);
    const { navigateTo, article } = this.props;
    const route = {
      screen: ext('AddAReviewScreen'),
      props: {
        id: article.id,
        onClose: closeModal,
      },
    };
    navigateTo(route);
  }

  mapToMap() {
    const { mapReviews, reviews, article, initialReviews } = this.props;
    console.log(reviews);
    const newObj = {};
    let found = true;
    let i = 0;
    _.keys(reviews[article.id]).reverse().map(function (dataKey, index) {
      if (i === 5) found = false;
      if (found) {
        newObj[dataKey] = reviews[article.id][dataKey];
        i++;
      }
    });
    mapReviews(newObj, article.id);
    initialReviews(newObj, article.id);
  }

  addAReview(rating) {
    console.log(this.props);
    const { navigateTo, article } = this.props;
    console.log(rating);
    const route = {
      screen: ext('AddAReviewScreen'),
      props: {
        user: 'Billy',
        id: article.id,
        rating,
      },
    };
    navigateTo(route);
  }

  renderUpNext() {
    const { nextArticle, openArticle } = this.props;
    if (nextArticle && openArticle) {
      return (
        <NextArticle
          title={nextArticle.title}
          imageUrl={_.get(nextArticle, 'image.url')}
          openArticle={() => openArticle(nextArticle)}
        />
      );
    }
    return null;
  }

  renderRow(data, rowId) {
    return <Review data={data} key={rowId} />;
  }

  render() {
    const { article, initial, loader } = this.props;
    //  const { data } = this.state;
    const articleImage = article.image ? { uri: _.get(article, 'image.url') } : undefined;
    console.log(initial);
    if (loader.isLoading) {
      return (
        <Screen styleName="full-screen paper" style={{ justifyContent: 'center' }}>
          <NavigationBar
            title={article.title}
          />
          <ActivityIndicator size="large" style={{ alignSelf: 'center' }} />
        </Screen>
      );
    }
    return (
      <Screen styleName="full-screen paper">
        <NavigationBar
          styleName="clear"
          animationName="solidify"
          title={article.title}
          share={{
            link: article.link,
            title: article.title,
          }}
        />
        <ScrollView>
          <GameBanner article={article} articleImage={articleImage} />
          <GameStats lastReview={this.state.lastReview} rating={this.state.rating} article={article} />
          <Divider styleName="line" />
          <Title styleName="h-center">Reviews</Title>
          {
            (initial !== undefined && initial[article.id] !== undefined
              && initial !== null && initial[article.id] !== null) ?
              <ListView
                data={initial[article.id]}
                renderRow={this.renderRow}
                loading={loader.isLoading}
              //  onLoadMore={this.getMoreReviews}
              />
              :
              loader.isLoading ? <ActivityIndicator size="small" /> : <Text>No reviews yet</Text>
          }
          <GameButtons
            article={article}
            addAReview={this.addAReview}
            openListScreen={this.openListScreen}
            getReviews={this.getReview}
          />
          {this.renderUpNext()}
        </ScrollView>
      </Screen>
    );
  }
}

const mapDispatchToProps = {
  openInModal,
  closeModal,
  addReviews,
  addAReview,
  reviewsLoaded,
  reviewsFetchError,
  reviewsLoading,
  navigateTo,
  mapReviews,
  initialReviews,
};

const mapStateToProps = (state) => {
  const { reviews, loader, map, initial } = state[ext()];
  return {
    reviews,
    loader,
    map,
    initial,
  };
};

export default loginRequired(
  connect(mapStateToProps, mapDispatchToProps)(
    connectStyle(ext('ReviewLayoutScreen')
    )(ReviewLayoutScreen))
);
