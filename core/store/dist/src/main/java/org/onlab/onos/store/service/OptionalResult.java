package org.onlab.onos.store.service;

/**
 * A container object which either has a result or an exception.
 * <p>
 * If a result is present, get() will return it otherwise get() will throw
 * the exception that was encountered in the process of generating the result.
 *
 * @param <R> type of result.
 * @param <E> exception encountered in generating the result.
 */
public interface OptionalResult<R, E extends Throwable> {

    /**
     * Returns the result.
     * @return result
     * @throws E if there is no valid result.
     */
    public R get();

    /**
     * Returns true if there is a valid result.
     * @return true is yes, false otherwise.
     */
    public boolean hasValidResult();
}
