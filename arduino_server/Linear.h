#ifndef LINEAR_H_
#define LINEAR_H_

#include "Control.h"

class Linear : public Control
{
public:
	// constructor
	Linear();
	
	// destructor
	virtual ~Linear();
	
	// getters / setters
	virtual Type getType();
	virtual const String& getStringType() const;
	virtual void updatePort();
	int getMin();
	void setMin(int min);
	int getMax();
	void setMax(int max);
	int getValue();
	void setValue(int value);
	
private:
	// variables
	int min;
	int max;
	int value;
};

#endif /* LINEAR_H_ */
