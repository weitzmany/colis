# Observability Implementation Guide

Comprehensive guide for implementing monitoring, logging, tracing, and metrics to achieve full observability in applications and systems.

**Last Updated**: 2026-01-05

## Table of Contents

1. [Fundamental Principles](#fundamental-principles)
2. [The Three Pillars of Observability](#the-three-pillars-of-observability)
3. [Monitoring Implementation](#monitoring-implementation)
4. [Logging Implementation](#logging-implementation)
5. [Tracing Implementation](#tracing-implementation)
6. [Metrics Implementation](#metrics-implementation)
7. [Observability Tools and Platforms](#observability-tools-and-platforms)
8. [Service Level Objectives (SLOs) and Indicators (SLIs)](#service-level-objectives-slos-and-indicators-slis)
9. [Alerting Strategies](#alerting-strategies)
10. [Observability Best Practices](#observability-best-practices)
11. [Observability Implementation Checklist](#observability-implementation-checklist)

## Fundamental Principles

### Core Observability Values

1. **Visibility into Systems**
   - Complete visibility into application behavior
   - Real-time understanding of system health
   - Ability to understand what's happening and why
   - Proactive issue detection and resolution

2. **Data-Driven Decisions**
   - Base decisions on metrics and data
   - Measure before optimizing
   - Use data to identify bottlenecks and issues
   - Track improvements over time

3. **Three Pillars Integration**
   - Metrics for trends and alerting
   - Logs for detailed event context
   - Traces for request flow understanding
   - Correlate all three for complete picture

4. **Production-First Thinking**
   - Design for production observability from the start
   - Instrument code during development
   - Test observability in staging environments
   - Ensure production observability is reliable

### Observability Framework

```
┌─────────────────────────────────────┐
│   Application Code                  │
│   (Business Logic)                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Instrumentation Layer             │
│   - Metrics Collection              │
│   - Logging                         │
│   - Tracing                         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Collection & Aggregation          │
│   - Prometheus (Metrics)            │
│   - ELK/Loki (Logs)                 │
│   - Jaeger/Zipkin (Traces)          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Storage & Analysis                │
│   - Time-series DB (Metrics)        │
│   - Log Storage (Logs)              │
│   - Trace Storage (Traces)          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Visualization & Alerting          │
│   - Grafana (Dashboards)            │
│   - Alerting (PagerDuty, etc.)      │
│   - Analysis Tools                  │
└─────────────────────────────────────┘
```

## The Three Pillars of Observability

### Metrics

**Definition**: Numerical measurements over time, aggregated data points

**Characteristics**:
- High cardinality time-series data
- Aggregated values (counts, averages, percentiles)
- Low storage overhead
- Fast queries for trends

**Use Cases**:
- Performance trends and capacity planning
- Real-time alerting
- Dashboards and visualization
- Business metrics tracking

**Example Metrics**:
- Request rate (requests per second)
- Error rate (errors per second)
- Response time (p50, p95, p99 latency)
- CPU usage (percentage)
- Active connections (count)

### Logs

**Definition**: Discrete events with detailed context, structured data

**Characteristics**:
- Individual event records
- Rich contextual information
- Higher storage requirements
- Slower queries for detailed analysis

**Use Cases**:
- Debugging and troubleshooting
- Security event analysis
- Audit trails and compliance
- Understanding user behavior

**Example Logs**:
- Error logs with stack traces
- Access logs with request details
- Application logs with business events
- Audit logs for compliance

### Traces

**Definition**: Request flows through distributed systems, end-to-end paths

**Characteristics**:
- Distributed request context
- Service dependency mapping
- Latency breakdown by service
- Higher storage overhead for full traces

**Use Cases**:
- Performance bottleneck identification
- Service dependency analysis
- Error root cause analysis
- Understanding request flows

**Example Traces**:
- HTTP request through microservices
- Database query execution path
- API call chains
- Distributed transaction flows

## Monitoring Implementation

### Application Performance Monitoring (APM)

#### Key Metrics to Monitor

1. **Response Times**
   - Average response time
   - Percentiles (p50, p95, p99, p99.9)
   - Response time by endpoint
   - Response time trends

2. **Throughput**
   - Requests per second (RPS)
   - Transactions per second (TPS)
   - Concurrent users
   - Request volume trends

3. **Error Rates**
   - Error rate percentage
   - Errors by type
   - Errors by endpoint
   - Error rate trends

4. **Resource Usage**
   - CPU utilization
   - Memory usage
   - Disk I/O
   - Network bandwidth

#### PHP Implementation Example

```php
<?php
// Metrics collection middleware
class MetricsMiddleware
{
    private $metrics;
    
    public function __construct(MetricsCollector $metrics)
    {
        $this->metrics = $metrics;
    }
    
    public function __invoke(
        Request $request,
        RequestHandler $handler
    ): Response {
        $startTime = microtime(true);
        
        try {
            $response = $handler->handle($request);
            
            // Record success metrics
            $duration = (microtime(true) - $startTime) * 1000; // ms
            $this->metrics->histogram('http_request_duration_ms', $duration, [
                'method' => $request->getMethod(),
                'route' => $request->getAttribute('route'),
                'status' => $response->getStatusCode()
            ]);
            
            $this->metrics->increment('http_requests_total', [
                'method' => $request->getMethod(),
                'route' => $request->getAttribute('route'),
                'status' => $response->getStatusCode()
            ]);
            
            return $response;
        } catch (\Exception $e) {
            // Record error metrics
            $this->metrics->increment('http_requests_errors_total', [
                'method' => $request->getMethod(),
                'route' => $request->getAttribute('route'),
                'error_type' => get_class($e)
            ]);
            
            throw $e;
        }
    }
}
```

### Infrastructure Monitoring

#### Server Metrics

- **CPU**: Usage percentage, load average, per-core metrics
- **Memory**: Used, available, cached, buffers, swap usage
- **Disk**: Usage percentage, I/O operations, read/write throughput
- **Network**: Bandwidth, packets, errors, connections

#### Container Metrics

- Container CPU usage
- Container memory usage
- Container network metrics
- Container restart counts
- Container health status

#### Database Metrics

- Connection pool usage
- Query performance (slow queries)
- Transaction rates
- Lock contention
- Replication lag

### Real-Time Alerting

#### Alert Types

1. **Availability Alerts**
   - Service down
   - High error rate
   - Health check failures

2. **Performance Alerts**
   - High latency
   - Low throughput
   - Resource exhaustion

3. **Business Alerts**
   - Anomaly detection
   - Threshold violations
   - Trend changes

#### Alert Configuration

```yaml
# Prometheus Alert Rules Example
groups:
  - name: application_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_errors_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors/sec"
      
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m])) > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
          description: "95th percentile latency is {{ $value }}ms"
```

## Logging Implementation

### Structured Logging

#### JSON Format

Structured logging uses JSON format for consistent parsing and analysis:

```php
<?php
// ✅ DO: Structured logging with JSON
logger()->info('User action completed', [
    'timestamp' => date('c'),
    'level' => 'INFO',
    'correlation_id' => $correlationId,
    'user_id' => $userId,
    'action' => 'question_created',
    'question_id' => $questionId,
    'duration_ms' => $duration,
    'ip_address' => $request->getAttribute('ip_address'),
    'user_agent' => $request->getHeaderLine('User-Agent')
]);

// ❌ DON'T: Unstructured string concatenation
logger()->info("User $userId created question $questionId in {$duration}ms");
```

#### Log Levels

1. **DEBUG**: Detailed information for debugging
2. **INFO**: General informational messages
3. **WARN**: Warning messages for potential issues
4. **ERROR**: Error messages for failures
5. **CRITICAL**: Critical errors requiring immediate attention

#### Log Levels Best Practices

```php
// DEBUG: Detailed debugging information
logger()->debug('Database query executed', [
    'query' => $sql,
    'params' => $params,
    'duration_ms' => $duration
]);

// INFO: Normal operation events
logger()->info('User logged in', [
    'user_id' => $userId,
    'method' => 'password'
]);

// WARN: Unexpected but handled situations
logger()->warning('Rate limit approaching', [
    'user_id' => $userId,
    'current_rate' => $currentRate,
    'limit' => $rateLimit
]);

// ERROR: Error conditions that don't stop execution
logger()->error('Failed to send email', [
    'user_id' => $userId,
    'error' => $exception->getMessage(),
    'error_code' => $exception->getCode()
]);

// CRITICAL: Critical errors requiring immediate action
logger()->critical('Database connection failed', [
    'error' => $exception->getMessage(),
    'host' => $dbHost
]);
```

### Correlation IDs

Correlation IDs link logs, traces, and metrics for a single request:

```php
<?php
// Generate correlation ID at request entry point
class CorrelationIdMiddleware
{
    public function __invoke(
        Request $request,
        RequestHandler $handler
    ): Response {
        $correlationId = $request->getHeaderLine('X-Correlation-ID');
        
        if (empty($correlationId)) {
            $correlationId = bin2hex(random_bytes(16));
        }
        
        // Store in request attributes
        $request = $request->withAttribute('correlation_id', $correlationId);
        
        // Include in all logs
        $context = ['correlation_id' => $correlationId];
        
        // Add to response headers
        $response = $handler->handle($request);
        return $response->withHeader('X-Correlation-ID', $correlationId);
    }
}

// Use correlation ID in logs
logger()->info('Processing request', [
    'correlation_id' => $request->getAttribute('correlation_id'),
    'user_id' => $userId,
    'action' => 'create_question'
]);
```

### Log Aggregation

#### Centralized Logging Architecture

```
Application Servers
       │
       ├─> Log Agent (Filebeat, Fluentd)
       │
       ▼
Log Aggregator (Logstash, Fluentd)
       │
       ▼
Log Storage (Elasticsearch, Loki)
       │
       ▼
Log Analysis (Kibana, Grafana)
```

#### Log Retention Policies

- **Development**: 7 days
- **Staging**: 30 days
- **Production**: 90 days (compliance requirements may vary)
- **Security/Audit Logs**: 1-7 years (based on compliance)

### Sensitive Data Sanitization

```php
<?php
class LogSanitizer
{
    private $sensitiveFields = [
        'password',
        'password_confirmation',
        'credit_card',
        'ssn',
        'api_key',
        'token',
        'secret'
    ];
    
    public function sanitize(array $data): array
    {
        foreach ($this->sensitiveFields as $field) {
            if (isset($data[$field])) {
                $data[$field] = '[REDACTED]';
            }
        }
        
        return $data;
    }
}

// Usage
$logData = $sanitizer->sanitize([
    'user_id' => 123,
    'email' => 'user@example.com',
    'password' => 'secret123', // Will be redacted
    'action' => 'login'
]);

logger()->info('User login attempt', $logData);
```

## Tracing Implementation

### Distributed Tracing Concepts

#### Spans

A span represents a single operation in a trace:

- **Span Name**: Operation name (e.g., "HTTP GET /api/questions")
- **Span Start/End Time**: Operation duration
- **Span Tags**: Key-value pairs for filtering and analysis
- **Span Logs**: Event logs within the span
- **Span Context**: Trace ID, Span ID, Parent Span ID

#### Traces

A trace represents a request flow through the system:

- **Trace ID**: Unique identifier for the entire trace
- **Root Span**: First span in the trace
- **Child Spans**: Nested operations within the trace
- **Service Dependencies**: Services involved in the trace

### Trace Instrumentation

#### Automatic Instrumentation

Many frameworks support automatic instrumentation:

```php
<?php
// OpenTelemetry PHP automatic instrumentation
use OpenTelemetry\SDK\Trace\TracerProvider;
use OpenTelemetry\SDK\Trace\SpanProcessor;

$tracerProvider = new TracerProvider([
    new BatchSpanProcessor($exporter)
]);

$tracer = $tracerProvider->getTracer('my-service');
```

#### Manual Span Creation

```php
<?php
class QuestionService
{
    private $tracer;
    
    public function createQuestion(array $data): Question
    {
        $span = $this->tracer->spanBuilder('create_question')
            ->setAttribute('question.topic', $data['topic'])
            ->setAttribute('question.difficulty', $data['difficulty'])
            ->startSpan();
        
        try {
            $span->addEvent('validating_input');
            $this->validateInput($data);
            
            $span->addEvent('saving_to_database');
            $question = $this->repository->create($data);
            
            $span->setAttribute('question.id', $question->id);
            $span->setStatus(StatusCode::STATUS_OK);
            
            return $question;
        } catch (\Exception $e) {
            $span->setStatus(StatusCode::STATUS_ERROR, $e->getMessage());
            $span->recordException($e);
            throw $e;
        } finally {
            $span->end();
        }
    }
}
```

### Trace Context Propagation

```php
<?php
// Extract trace context from HTTP headers
class TraceContextMiddleware
{
    private $tracer;
    
    public function __invoke(
        Request $request,
        RequestHandler $handler
    ): Response {
        $context = $this->extractContext($request);
        
        $span = $this->tracer->spanBuilder('http_request')
            ->setParent($context)
            ->setAttribute('http.method', $request->getMethod())
            ->setAttribute('http.url', $request->getUri())
            ->startSpan();
        
        try {
            $scope = $span->activate();
            $response = $handler->handle($request);
            return $response;
        } finally {
            $span->end();
            $scope->detach();
        }
    }
    
    private function extractContext(Request $request): Context
    {
        // Extract from headers (W3C Trace Context format)
        $traceParent = $request->getHeaderLine('Traceparent');
        if (!empty($traceParent)) {
            return Context::parseW3CTraceParent($traceParent);
        }
        
        return Context::getCurrent();
    }
}
```

### Trace Sampling

For high-volume applications, sample traces to reduce storage costs:

```php
<?php
class TraceSampler
{
    private $sampleRate; // e.g., 0.1 = 10% sampling
    
    public function shouldSample(
        Context $context,
        string $traceId,
        string $spanName,
        int $spanKind
    ): SamplingResult {
        // Always sample errors
        if ($this->isError($context)) {
            return SamplingResult::RECORD_AND_SAMPLE;
        }
        
        // Sample based on rate
        if (random_int(0, 100) < ($this->sampleRate * 100)) {
            return SamplingResult::RECORD_AND_SAMPLE;
        }
        
        return SamplingResult::DROP;
    }
}
```

## Metrics Implementation

### Metric Types

#### Counter

Counters represent cumulative values that only increase:

```php
<?php
// Counter: Total requests
$metrics->increment('http_requests_total', [
    'method' => 'GET',
    'endpoint' => '/api/questions',
    'status' => '200'
]);

// Counter with increment value
$metrics->incrementBy('messages_processed_total', 5, [
    'queue' => 'notifications'
]);
```

#### Gauge

Gauges represent values that can go up or down:

```php
<?php
// Gauge: Active connections
$metrics->gauge('database_connections_active', $activeConnections, [
    'database' => 'primary'
]);

// Gauge: Cache size
$metrics->gauge('cache_size_bytes', $cacheSize, [
    'cache_type' => 'redis'
]);
```

#### Histogram

Histograms track distribution of values:

```php
<?php
// Histogram: Response time
$metrics->histogram('http_request_duration_ms', $duration, [
    'method' => 'GET',
    'endpoint' => '/api/questions'
]);

// Histogram: Request size
$metrics->histogram('http_request_size_bytes', $requestSize, [
    'method' => 'POST'
]);
```

#### Summary

Summaries provide quantiles (percentiles) and counts:

```php
<?php
// Summary: Response time with quantiles
$metrics->summary('api_response_time_ms', $duration, [
    'quantiles' => [0.5, 0.95, 0.99],
    'endpoint' => '/api/questions'
]);
```

### Custom Business Metrics

```php
<?php
// Business metrics
$metrics->counter('questions_created_total', [
    'topic' => 'boolean_logic',
    'difficulty' => 'beginner'
]);

$metrics->histogram('user_session_duration_seconds', $sessionDuration, [
    'user_type' => 'premium'
]);

$metrics->gauge('active_users', $activeUserCount, [
    'segment' => 'engaged'
]);
```

### Metric Labels and Cardinality

**Best Practices**:
- Use labels for filtering and grouping
- Avoid high-cardinality labels (e.g., user IDs)
- Prefer bounded label values
- Limit number of label combinations

```php
// ✅ GOOD: Bounded label values
$metrics->increment('http_requests_total', [
    'method' => 'GET',      // Bounded: GET, POST, PUT, DELETE
    'status_class' => '2xx' // Bounded: 2xx, 3xx, 4xx, 5xx
]);

// ❌ BAD: High cardinality
$metrics->increment('http_requests_total', [
    'user_id' => $userId,     // High cardinality: thousands of users
    'session_id' => $sessionId // High cardinality: millions of sessions
]);
```

## Observability Tools and Platforms

### Monitoring & Metrics

#### Prometheus

- **Type**: Time-series database and metrics collection
- **Use Cases**: Metrics collection, alerting
- **Strengths**: Powerful query language, pull-based model
- **Integration**: Works with Grafana for visualization

#### Grafana

- **Type**: Visualization and dashboard platform
- **Use Cases**: Metrics visualization, dashboard creation
- **Strengths**: Rich visualization options, alerting
- **Integration**: Works with Prometheus, InfluxDB, Elasticsearch

#### Datadog

- **Type**: APM and infrastructure monitoring
- **Use Cases**: Full-stack observability
- **Strengths**: Easy setup, comprehensive monitoring
- **Integration**: Multiple integrations, cloud-native

#### New Relic

- **Type**: Application performance monitoring
- **Use Cases**: APM, infrastructure monitoring
- **Strengths**: Easy integration, powerful analytics
- **Integration**: Wide language support

#### CloudWatch (AWS)

- **Type**: AWS-native monitoring and logging
- **Use Cases**: AWS resource monitoring
- **Strengths**: Native AWS integration, logs and metrics
- **Integration**: Tight AWS integration

### Logging

#### ELK Stack (Elasticsearch, Logstash, Kibana)

- **Elasticsearch**: Log storage and search
- **Logstash**: Log aggregation and processing
- **Kibana**: Log visualization and analysis
- **Use Cases**: Centralized logging, log analysis
- **Strengths**: Powerful search, flexible processing

#### Loki (Grafana Labs)

- **Type**: Log aggregation system
- **Use Cases**: Log aggregation, integration with Grafana
- **Strengths**: Lightweight, Prometheus-like query language
- **Integration**: Native Grafana integration

#### Splunk

- **Type**: Enterprise log analysis
- **Use Cases**: Enterprise logging, security analysis
- **Strengths**: Powerful search, enterprise features
- **Integration**: Wide platform support

### Tracing

#### Jaeger

- **Type**: Distributed tracing
- **Use Cases**: Distributed tracing, service dependency mapping
- **Strengths**: Open source, CNCF project
- **Integration**: OpenTelemetry, multiple languages

#### Zipkin

- **Type**: Distributed tracing
- **Use Cases**: Request tracing, latency analysis
- **Strengths**: Simple, lightweight
- **Integration**: Multiple language clients

#### AWS X-Ray

- **Type**: AWS-native distributed tracing
- **Use Cases**: AWS application tracing
- **Strengths**: Native AWS integration
- **Integration**: AWS services

## Service Level Objectives (SLOs) and Indicators (SLIs)

### SLI (Service Level Indicator)

SLIs are measurable aspects of service quality:

**Common SLIs**:
- **Availability**: Percentage of successful requests
- **Latency**: Response time percentiles (p50, p95, p99)
- **Error Rate**: Percentage of requests that fail
- **Throughput**: Requests per second

**SLI Example**:
```
SLI: Request Availability
Measurement: Percentage of requests that return 2xx/3xx status codes
Time Window: 30 days
Calculation: (Successful Requests / Total Requests) × 100
```

### SLO (Service Level Objective)

SLOs are target values for SLIs:

**SLO Examples**:
- 99.9% availability (3 nines)
- p95 latency < 200ms
- Error rate < 0.1%
- 99.95% availability (3.5 nines)

**SLO Definition Example**:
```
SLO: API Availability
Target: 99.9% availability over 30-day rolling window
SLI: Request Availability (percentage of successful requests)
Measurement: (Successful Requests / Total Requests) × 100
Time Window: 30-day rolling window
```

### Error Budget

Error budget is the allowable error rate before violating an SLO:

**Error Budget Calculation**:
```
Error Budget = 100% - SLO Target

Example:
SLO: 99.9% availability
Error Budget: 100% - 99.9% = 0.1% (43.2 minutes per month)
```

**Error Budget Usage**:
- Use error budget for release decisions
- If error budget is consumed, stop risky releases
- Prioritize reliability over new features when budget is low

## Alerting Strategies

### Alerting Best Practices

1. **Alert on Symptoms, Not Causes**
   - ✅ Alert on: High error rate, high latency
   - ❌ Alert on: High CPU usage (symptom, not cause)

2. **Avoid Alert Fatigue**
   - Only alert on actionable issues
   - Use alert grouping and correlation
   - Set appropriate thresholds
   - Review and tune alerts regularly

3. **Alert Severity Levels**
   - **Critical**: Immediate action required (service down)
   - **Warning**: Attention needed soon (degraded performance)
   - **Info**: Informational (threshold approaching)

4. **Alert Routing**
   - Critical → On-call engineer
   - Warning → Team channel
   - Info → Monitoring dashboard

### Alert Configuration Example

```yaml
# Alert Rules
groups:
  - name: availability_alerts
    rules:
      # Critical: Service down
      - alert: ServiceDown
        expr: up{job="api"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
      
      # Warning: High error rate
      - alert: HighErrorRate
        expr: rate(http_requests_errors_total[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Error rate is {{ $value }} errors/sec"
      
      # Warning: High latency
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m])) > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "95th percentile latency is {{ $value }}ms"
```

## Observability Best Practices

### Development Phase

1. **Instrument Early**: Add observability during development
2. **Use Structured Logging**: JSON format from the start
3. **Add Correlation IDs**: Implement at request entry points
4. **Define Metrics**: Identify key metrics during design
5. **Test Observability**: Verify in staging environments

### Production Phase

1. **Monitor Dashboards**: Set up key dashboards
2. **Configure Alerting**: Set up critical alerts
3. **Define SLOs**: Establish service level objectives
4. **Document Runbooks**: Document common issues and solutions
5. **Review Regularly**: Review metrics and alerts regularly

### Maintenance Phase

1. **Tune Alerting**: Adjust thresholds based on data
2. **Optimize Costs**: Review retention and sampling strategies
3. **Update Runbooks**: Keep documentation current
4. **Review SLOs**: Adjust based on business needs
5. **Improve Continuously**: Refine observability based on learnings

### Cost Optimization

1. **Log Sampling**: Sample logs for high-volume endpoints
2. **Trace Sampling**: Sample traces (e.g., 10% sampling rate)
3. **Retention Policies**: Set appropriate retention periods
4. **Metric Cardinality**: Limit high-cardinality metrics
5. **Storage Optimization**: Use compression and aggregation

## Observability Implementation Checklist

### Setup and Configuration

- [ ] Observability tools selected and configured
- [ ] Metrics collection implemented (counters, gauges, histograms)
- [ ] Structured logging implemented with JSON format
- [ ] Distributed tracing implemented
- [ ] Correlation IDs implemented across services
- [ ] Log aggregation configured
- [ ] Trace storage configured
- [ ] Metrics storage configured

### Instrumentation

- [ ] Application code instrumented with metrics
- [ ] Key business events logged
- [ ] Critical paths traced
- [ ] Error handling includes observability
- [ ] Database queries instrumented
- [ ] External API calls traced
- [ ] Background jobs instrumented
- [ ] Authentication/authorization events logged

### Dashboards and Visualization

- [ ] Key metrics dashboards created
- [ ] Service health dashboard created
- [ ] Business metrics dashboard created
- [ ] Error tracking dashboard created
- [ ] Performance dashboard created
- [ ] Dashboards reviewed and updated regularly

### Alerting

- [ ] Critical alerts configured (service down, high error rate)
- [ ] Warning alerts configured (degraded performance)
- [ ] Alert thresholds tuned based on data
- [ ] Alert routing configured (on-call, teams)
- [ ] Alert grouping and correlation configured
- [ ] Alert fatigue prevention measures in place

### SLOs and SLIs

- [ ] SLIs defined (availability, latency, error rate)
- [ ] SLOs defined with targets
- [ ] Error budgets calculated
- [ ] SLO tracking implemented
- [ ] SLO dashboards created
- [ ] Release process considers error budgets

### Documentation

- [ ] Runbooks documented for common issues
- [ ] Alert response procedures documented
- [ ] Observability architecture documented
- [ ] Tool configurations documented
- [ ] On-call procedures documented

### Security and Compliance

- [ ] Sensitive data sanitized in logs
- [ ] Access controls configured for observability tools
- [ ] Audit logging configured for compliance
- [ ] Log retention policies meet compliance requirements
- [ ] Data encryption configured for observability data

### Testing and Validation

- [ ] Observability tested in staging environment
- [ ] Alerting tested (test alerts sent)
- [ ] Dashboards validated with real data
- [ ] Trace sampling validated
- [ ] Log aggregation validated
- [ ] Metrics collection validated

---

## Review/Contribution

**Expert**: Nicole Chen  
**Expertise**: Observability (Monitoring, Logging, Tracing, Metrics)  
**Date**: 2026-01-05  
**Changes**: Created comprehensive observability implementation guide covering fundamental principles (visibility into systems, data-driven decisions, three pillars integration, production-first thinking) with observability framework diagram, the three pillars of observability (metrics definition and use cases, logs definition and use cases, traces definition and use cases), monitoring implementation (application performance monitoring with key metrics and PHP implementation examples, infrastructure monitoring with server/container/database metrics, real-time alerting with alert types and Prometheus configuration examples), logging implementation (structured logging with JSON format and log levels best practices, correlation IDs implementation with middleware examples, log aggregation architecture and retention policies, sensitive data sanitization), tracing implementation (distributed tracing concepts with spans and traces, trace instrumentation with automatic and manual span creation examples, trace context propagation with middleware, trace sampling strategies), metrics implementation (metric types including counters/gauges/histograms/summaries with PHP examples, custom business metrics, metric labels and cardinality best practices), observability tools and platforms (monitoring tools including Prometheus/Grafana/Datadog/New Relic/CloudWatch, logging tools including ELK/Loki/Splunk, tracing tools including Jaeger/Zipkin/AWS X-Ray), service level objectives and indicators (SLI definition and examples, SLO definition and examples, error budget calculation and usage), alerting strategies (alerting best practices, alert severity levels, alert routing, alert configuration examples), observability best practices (development phase, production phase, maintenance phase, cost optimization), and comprehensive observability implementation checklist covering setup/configuration, instrumentation, dashboards/visualization, alerting, SLOs/SLIs, documentation, security/compliance, and testing/validation. This guide provides practical, actionable guidance for implementing comprehensive observability in applications through monitoring, logging, tracing, and metrics, ensuring systems have full visibility for reliability and performance optimization.

---
