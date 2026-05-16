/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
  token?: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
  token,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your sign-in code for The Formation Arc</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to The Formation Arc</Heading>
        <Text style={text}>
          You've taken the first step into a quieter way of paying attention.
          Enter the code below in the app to confirm{' '}
          <Link href={`mailto:${recipient}`} style={link}>
            ({recipient})
          </Link>{' '}
          and begin.
        </Text>
        {token ? (
          <Section style={codeWrap}>
            <Text style={code}>{token}</Text>
          </Section>
        ) : null}
        <Text style={smallText}>
          The code expires shortly. You can also{' '}
          <Link href={confirmationUrl} style={link}>
            confirm via this link
          </Link>
          .
        </Text>
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
const smallText = {
  fontSize: '13px',
  color: '#8a9598',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const link = { color: '#0C4651', textDecoration: 'underline' }
const codeWrap = {
  backgroundColor: '#F1F5F4',
  borderRadius: '14px',
  padding: '20px 24px',
  textAlign: 'center' as const,
  margin: '0 0 16px',
}
const code = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fontSize: '32px',
  fontWeight: 600 as const,
  color: '#0C4651',
  letterSpacing: '0.4em',
  margin: 0,
  lineHeight: '1.2',
}
const footer = {
  fontSize: '13px',
  color: '#8a9598',
  lineHeight: '1.6',
  margin: '32px 0 0',
}
