/*
 * Copyright 2017-present Open Networking Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.onosproject.incubator.net.l2monitoring.soam.delay;

import java.time.Duration;
import java.time.Instant;

/**
 * The default implementation of DelayMeasurementStatCurrent.
 * {@link org.onosproject.incubator.net.l2monitoring.soam.delay.DelayMeasurementStatCurrent}.
 */
public final class DefaultDelayMeasurementStatCurrent
    extends DefaultDelayMeasurementStat
    implements DelayMeasurementStatCurrent {

    private final Instant startTime;

    protected DefaultDelayMeasurementStatCurrent(DefaultDmStatCurrentBuilder builder) {
        super(builder);
        this.startTime = builder.startTime;
    }

    @Override
    public Instant startTime() {
        return startTime;
    }

    public static DmStatCurrentBuilder builder(Duration elapsedTime, boolean suspectStatus) {
        return new DefaultDmStatCurrentBuilder(elapsedTime, suspectStatus);
    }

    /**
     * Builder for {@link org.onosproject.incubator.net.l2monitoring.soam.delay.DelayMeasurementStatCurrent}.
     */
    private static final class DefaultDmStatCurrentBuilder extends DefaultDmStatBuilder
        implements DmStatCurrentBuilder {

        private Instant startTime;

        private DefaultDmStatCurrentBuilder(Duration elapsedTime, boolean suspectStatus) {
            super(elapsedTime, suspectStatus);
        }

        @Override
        public DmStatCurrentBuilder startTime(Instant startTime) {
            this.startTime = startTime;
            return this;
        }

        @Override
        public DelayMeasurementStat build() {
            return new DefaultDelayMeasurementStatCurrent(this);
        }
    }
}
