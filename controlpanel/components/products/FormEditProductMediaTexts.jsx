import React from 'react';
import { toast } from 'react-toastify';
import {
  compose, pure, mapProps, withHandlers, withState,
} from 'recompose';
import {
  Segment, Container, Menu, Button,
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import AutoField from 'uniforms-semantic/AutoField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import AutoForm from 'uniforms-semantic/AutoForm';
import getConfig from 'next/config';
import withFormSchema from '../../lib/withFormSchema';
import withFormModel from '../../lib/withFormModel';
import withFormErrorHandlers from '../../lib/withFormErrorHandlers';

const { publicRuntimeConfig } = getConfig();

const FormEditProductMediaTexts = ({
  languages, changeSelectedLocale, activeLanguage, onCancel, isEditingDisabled, ...formProps
}) => (
  <Container>
    <AutoForm {...formProps} disabled={isEditingDisabled}>
      <Menu attached="top" tabular>
        {languages.map(language => (
          <Menu.Item
            key={`menu-item-${language._id}`}
            name={language.isoCode}
            active={(activeLanguage) === language.isoCode}
            onClick={changeSelectedLocale}
          >
            {language.name}
          </Menu.Item>
        ))}
      </Menu>
      <Segment attached="bottom">
        {languages.map((language, key) => (
          <div key={`form-${language.isoCode}`}>
            <AutoField
              name={`texts.${key}.locale`}
              disabled={isEditingDisabled}
              hidden
            />
            <AutoField
              name={`texts.${key}.title`}
              disabled={isEditingDisabled}
              hidden={language.isoCode !== activeLanguage}
            />
            <AutoField
              name={`texts.${key}.subtitle`}
              disabled={isEditingDisabled}
              hidden={language.isoCode !== activeLanguage}
            />
          </div>
        ))}
        <ErrorsField />
        <br />
        <SubmitField value="Save" className="primary" disabled={isEditingDisabled} />
        <Button type="normal" onClick={onCancel}>
Abbrechen
        </Button>
      </Segment>
    </AutoForm>
  </Container>
);

export default compose(
  graphql(gql`
    query productMediaTexts($productMediaId: ID!) {
      languages {
        _id
        isoCode
        isActive
        isBase
        name
      }
      translatedProductMediaTexts(productMediaId: $productMediaId) {
        _id
        locale
        title
        subtitle
      }
    }
  `),
  mapProps(({ data, ...rest }) => {
    const { languages = [] } = data;
    const filteredActiveLanguages = languages
      .filter(language => !!language.isBase);
    const baseLanguage = (
      filteredActiveLanguages.length > 0
        ? filteredActiveLanguages[0].isoCode
        : publicRuntimeConfig.LANG
    );
    return {
      data,
      languages,
      baseLanguage,
      ...rest,
    };
  }),
  withState('selectedLocale', 'setSelectedLocale', ({ baseLanguage }) => baseLanguage),
  graphql(gql`
    mutation updateProductMediaTexts($texts: [UpdateProductMediaTextInput!]!, $productMediaId: ID!) {
      updateProductMediaTexts(texts: $texts, productMediaId: $productMediaId) {
        _id
        locale
        title
        subtitle
      }
    }
  `, {
    options: {
      refetchQueries: [
        'productMediaTexts',
        'productMedia',
      ],
    },
  }),
  withFormSchema({
    texts: {
      type: Array,
      optional: true,
    },
    'texts.$': {
      type: Object,
      optional: true,
    },
    'texts.$.locale': {
      type: String,
      optional: false,
      label: 'Locale',
    },
    'texts.$.title': {
      type: String,
      optional: true,
      label: 'Titel',
    },
    'texts.$.subtitle': {
      type: String,
      optional: true,
      label: 'Untertitel',
    },
  }),
  withFormModel(({ data: { translatedProductMediaTexts = [] }, languages = [] }) => {
    const texts = languages.map((language) => {
      const foundTranslations = translatedProductMediaTexts
        .filter(translatedText => (translatedText.locale === language.isoCode));
      const localizedTextForLocale = (foundTranslations.length > 0
        ? { ...(foundTranslations[0]) }
        : { locale: language.isoCode }
      );
      localizedTextForLocale.labels = localizedTextForLocale.labels || [];
      return localizedTextForLocale;
    });
    return { texts };
  }),
  withHandlers({
    changeSelectedLocale: ({ setSelectedLocale }) => (event, element) => {
      setSelectedLocale(element.name);
    },
    onSubmitSuccess: () => () => {
      toast('Texts saved', { type: toast.TYPE.SUCCESS });
    },
    onSubmit: ({ productMediaId, mutate, schema }) => ({ ...dirtyInput }) => mutate({
      variables: {
        texts: schema.clean(dirtyInput).texts,
        productMediaId,
      },
    }),
  }),
  withFormErrorHandlers,
  mapProps(({
    setSelectedLocale, selectedLocale,
    baseLanguage, productMediaId, mutate, data, ...rest
  }) => ({
    activeLanguage: selectedLocale || baseLanguage,
    ...rest,
  })),
  pure,
)(FormEditProductMediaTexts);