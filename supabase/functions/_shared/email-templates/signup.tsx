/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email to begin with The Formation Arc</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to The Formation Arc</Heading>
        <Text style={text}>
          You've taken the first step into a quieter way of paying attention.
          Confirm your email{' '}
          <Link href={`mailto:${recipient}`} style={link}>
            ({recipient})
          </Link>{' '}
          to begin.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm and begin
        </Button>
        <Text style={footer}>
          If you didn't create an account with{' '}
          <Link href={siteUrl} style={link}>
            The Formation Arc
          </Link>
          , you can safely ignore this message.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Nunito, Helvetica, Arial, sans-serif',
}
const container = { padding: '32px 28px', maxWidth: '520px' }
const h1 = {
  fontFamily: 'Fraunces, Georgia, serif',
  fontSize: '26px',
  fontWeight: 500 as const,
  color: '#0C4651',
  margin: '0 0 24px',
  lineHeight: '1.25',
}
const text = {
  fontSize: '15px',
  color: '#5a6a6e',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const link = { color: '#0C4651', textDecoration: 'underline' }
const button = {
  backgroundColor: '#0C4651',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 600 as const,
  borderRadius: '14px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block',
}
const footer = {
  fontSize: '13px',
  color: '#8a9598',
  lineHeight: '1.6',
  margin: '32px 0 0',
}
